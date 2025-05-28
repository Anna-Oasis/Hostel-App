import { Request, Response, NextFunction } from 'express';
import { db } from '../config/dbConnection';
import { admissionModel } from '../models/admissionModel';
import { admissionSchema } from '../validation/admission.schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { PostgresError } from 'postgres';
import { uploadFile, getPublicUrl } from '../services/supabase/fileHandling';
import { supabaseBucket } from '../config/supabaseBucket';

// Interface for file uploads
interface MulterRequest extends Request {
  files?: {
    passportPhoto?: Express.Multer.File[];
    studentSignature?: Express.Multer.File[];
    parentGuardianSignature?: Express.Multer.File[];
  };
}

// Map enum values for clarity
const ApprovalStatusMap = {
  PENDING: '1',
  APPROVED: '2',
  REJECTED: '3',
} as const;

export const submitAdmission = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Received admission submission:', req.body);
    // Validate request body using zod schema
    console.log('Validating request body...');
    const validatedData = admissionSchema.parse({
      ...req.body,
      age: parseInt(req.body.age, 10), // Convert string to number
      previousResident: req.body.previousResident === 'true' || req.body.previousResident === true, // Convert to boolean
    });
    console.log('Validated admission data:', validatedData);

    // Validate file uploads
    console.log('Checking file uploads...');
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (
      !req.files?.passportPhoto?.[0] ||
      !req.files?.studentSignature?.[0] ||
      !req.files?.parentGuardianSignature?.[0]
    ) {
      console.log('Missing required files');
      return res.status(400).json({ error: 'All required files must be uploaded' });
    }

    // Validate dateOfBirth format (already enforced by schema)
    console.log('Validating dateOfBirth...');
    const dateOfBirth = validatedData.dateOfBirth; // String in YYYY-MM-DD

    // Parse declaration to match JSONB type
    console.log('Parsing declaration...');
    let declaration;
    try {
      declaration = JSON.parse(validatedData.declaration);
    } catch {
      console.log('Invalid declaration format');
      return res.status(400).json({ error: 'Invalid declaration format; must be valid JSON' });
    }

    // Upload files to Supabase
    console.log('Uploading files to Supabase...');
    const timestamp = Date.now();
    const uploads = [
      {
        buffer: req.files.passportPhoto[0].buffer,
        name: `${timestamp}-${req.files.passportPhoto[0].originalname}`,
        folder: 'passport',
      },
      {
        buffer: req.files.studentSignature[0].buffer,
        name: `${timestamp}-${req.files.studentSignature[0].originalname}`,
        folder: 'signature',
      },
      {
        buffer: req.files.parentGuardianSignature[0].buffer,
        name: `${timestamp}-${req.files.parentGuardianSignature[0].originalname}`,
        folder: 'parent',
      },
    ];

    const uploadResults = await Promise.all(
      uploads.map(({ buffer, name, folder }) => uploadFile(buffer, name, folder))
    );

    const errors = uploadResults.filter((result) => result.error);
    if (errors.length > 0) {
      console.log('File upload errors:', errors);
      // Clean up successful uploads
      const cleanupPaths = uploadResults
        .filter((result) => result.data)
        .map((result) => result.data.path);
      if (cleanupPaths.length > 0) {
        console.log('Cleaning up Supabase files:', cleanupPaths);
        await supabaseBucket.remove(cleanupPaths);
      }
      return res.status(500).json({ error: 'File upload to Supabase failed', details: errors[0].error.message });
    }

    const [passportResult, signatureResult, parentSignatureResult] = uploadResults;

    // Prepare admission data
    console.log('Preparing admission data...');
    const admissionData = {
      ...validatedData,
      approval: ApprovalStatusMap.PENDING, // '1' for PENDING
      academic_year: new Date().getFullYear().toString(),
      payment_id: undefined, // Let database generate serial value
      passportPhoto: passportResult.data.path, // Supabase path (e.g., passport/123456.jpg)
      studentSignature: signatureResult.data.path,
      parentGuardianSignature: parentSignatureResult.data.path,
      dateOfBirth, // String (YYYY-MM-DD)
      declaration, // Parsed JSON
      // Optional fields
      fatherContactForeign: req.body.fatherContactForeign || null,
      landline: null,
      guardianName: null,
      guardianOccupation: null,
      guardianResidentialAddress: null,
      guardianPin: null,
      guardianMobile: null,
      guardianLandline: null,
      guardianEmail: null,
    };

    // Insert into database
    console.log('Inserting into database...');
    const [newAdmission] = await db
      .insert(admissionModel)
      .values(admissionData)
      .returning();
    console.log('Database insertion successful:', newAdmission);

    // Transform response with public URLs
    console.log('Transforming response...');
    const responseAdmission = {
      ...newAdmission,
      approval: Object.keys(ApprovalStatusMap).find(
        (key) => ApprovalStatusMap[key as keyof typeof ApprovalStatusMap] === newAdmission.approval
      ) || newAdmission.approval,
      dateOfBirth: new Date(newAdmission.dateOfBirth).toISOString(), // Convert to ISO for response
      declaration: JSON.stringify(newAdmission.declaration),
      passportPhotoUrl: getPublicUrl(passportResult.data.path.split('/').pop()!, 'passport'),
      studentSignatureUrl: getPublicUrl(signatureResult.data.path.split('/').pop()!, 'signature'),
      parentGuardianSignatureUrl: getPublicUrl(parentSignatureResult.data.path.split('/').pop()!, 'parent'),
    };

    console.log('Admission submitted successfully:', responseAdmission);
    return res.status(201).json({
      message: 'Admission submitted successfully',
      admission: responseAdmission,
    });
  } catch (error) {
    console.error('Error in submitAdmission:', error);
    // Clean up Supabase files on error
    if (req.files) {
      const timestamp = Date.now();
      const paths = [
        `passport/${timestamp}-${req.files.passportPhoto?.[0]?.originalname}`,
        `signature/${timestamp}-${req.files.studentSignature?.[0]?.originalname}`,
        `parent/${timestamp}-${req.files.parentGuardianSignature?.[0]?.originalname}`,
      ].filter(Boolean);
      if (paths.length > 0) {
        console.log('Cleaning up Supabase files:', paths);
        await supabaseBucket.remove(paths);
      }
    }

    // Handle specific errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    if (error instanceof PostgresError) {
      if (error.code === '22007') {
        return res.status(400).json({ error: 'Invalid date format for dateOfBirth; must be YYYY-MM-DD' });
      }
      return res.status(500).json({ error: 'Database error', details: error.message });
    }
    if (error instanceof Error && error.message.includes('Only .jpeg, .png, .pdf files are allowed')) {
      return res.status(400).json({ error: 'Invalid file type', details: error.message });
    }

    // Generic error
    return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getAllAdmissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Fetching all admissions...');
    const admissions = await db.select().from(admissionModel);
    console.log('Retrieved admissions:', admissions.length);

    const responseAdmissions = admissions.map((admission) => ({
      ...admission,
      approval: Object.keys(ApprovalStatusMap).find(
        (key) => ApprovalStatusMap[key as keyof typeof ApprovalStatusMap] === admission.approval
      ) || admission.approval,
      dateOfBirth: new Date(admission.dateOfBirth).toISOString(),
      declaration: JSON.stringify(admission.declaration),
      passportPhotoUrl: getPublicUrl(admission.passportPhoto.split('/').pop()!, 'passport'),
      studentSignatureUrl: getPublicUrl(admission.studentSignature.split('/').pop()!, 'signature'),
      parentGuardianSignatureUrl: getPublicUrl(admission.parentGuardianSignature.split('/').pop()!, 'parent'),
    }));

    return res.status(200).json(responseAdmissions);
  } catch (error) {
    console.error('Error in getAllAdmissions:', error);
    return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getAdmissionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(`Fetching admission with ID: ${id}`);

    const admission = await db
      .select()
      .from(admissionModel)
      .where(eq(admissionModel.user_id, parseInt(id)))
      .limit(1);

    if (admission.length === 0) {
      console.log('Admission not found');
      return res.status(404).json({ error: 'Admission not found' });
    }

    const responseAdmission = {
      ...admission[0],
      approval: Object.keys(ApprovalStatusMap).find(
        (key) => ApprovalStatusMap[key as keyof typeof ApprovalStatusMap] === admission[0].approval
      ) || admission[0].approval,
      dateOfBirth: new Date(admission[0].dateOfBirth).toISOString(),
      declaration: JSON.stringify(admission[0].declaration),
      passportPhotoUrl: getPublicUrl(admission[0].passportPhoto.split('/').pop()!, 'passport'),
      studentSignatureUrl: getPublicUrl(admission[0].studentSignature.split('/').pop()!, 'signature'),
      parentGuardianSignatureUrl: getPublicUrl(admission[0].parentGuardianSignature.split('/').pop()!, 'parent'),
    };

    return res.status(200).json(responseAdmission);
  } catch (error) {
    console.error('Error in getAdmissionById:', error);
    return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};