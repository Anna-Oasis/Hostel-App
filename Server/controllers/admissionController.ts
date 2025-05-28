import { Request, Response, NextFunction } from 'express';
import { db } from '../config/dbConnection';
import { admissionModel } from '../models/admissionModel';
import { admissionSchema } from '../validation/admission.schema';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';
import { PostgresError } from 'postgres';
import { z } from 'zod';

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

    // Validate dateOfBirth format (already done in schema, but confirm for safety)
    console.log('Validating dateOfBirth...');
    const dateOfBirth = validatedData.dateOfBirth; // String in YYYY-MM-DD
    const dateTest = new Date(dateOfBirth);
    if (isNaN(dateTest.getTime())) {
      console.log('Invalid dateOfBirth format');
      return res.status(400).json({ error: 'Invalid dateOfBirth format; must be YYYY-MM-DD' });
    }

    // Parse declaration to match model's jsonb type
    console.log('Parsing declaration...');
    let declaration;
    try {
      declaration = JSON.parse(validatedData.declaration);
    } catch {
      console.log('Invalid declaration format');
      return res.status(400).json({ error: 'Invalid declaration format; must be valid JSON' });
    }

    // Prepare admission data
    console.log('Preparing admission data...');
    const admissionData = {
      ...validatedData,
      approval: ApprovalStatusMap.PENDING, // '1' for PENDING
      academic_year: new Date().getFullYear().toString(),
      payment_id: undefined, // Let database generate serial value
      passportPhoto: req.files.passportPhoto[0].path,
      studentSignature: req.files.studentSignature[0].path,
      parentGuardianSignature: req.files.parentGuardianSignature[0].path,
      dateOfBirth, // Use string (YYYY-MM-DD)
      declaration, // Parsed JSON
      // Optional fields
      fatherContactForeign: req.body.fatherContactForeign || null,
      landline: req.body.landline || null,
      guardianName: req.body.guardianName || null,
      guardianOccupation: req.body.guardianOccupation || null,
      guardianResidentialAddress: req.body.guardianResidentialAddress || null,
      guardianPin: req.body.guardianPin || null,
      guardianMobile: req.body.guardianMobile || null,
      guardianLandline: req.body.guardianLandline || null,
      guardianEmail: req.body.guardianEmail || null,
    };

    // Insert into database
    console.log('Inserting into database...');
    const [newAdmission] = await db
      .insert(admissionModel)
      .values(admissionData)
      .returning();
    console.log('Database insertion successful:', newAdmission);

    // Transform response
    console.log('Transforming response...');
    const responseAdmission = {
      ...newAdmission,
      approval: Object.keys(ApprovalStatusMap).find(
        (key) => ApprovalStatusMap[key as keyof typeof ApprovalStatusMap] === newAdmission.approval
      ) || newAdmission.approval,
      dateOfBirth: new Date(newAdmission.dateOfBirth).toISOString(), // Convert to ISO for response
      declaration: JSON.stringify(newAdmission.declaration),
    };

    console.log('Admission submitted successfully:', responseAdmission);
    res.status(201).json({
      message: 'Admission submitted successfully',
      admission: responseAdmission,
    });
  } catch (error) {
    console.error('Error in submitAdmission:', error);
    // Clean up uploaded files
    if (req.files) {
      const filePaths = [
        req.files.passportPhoto?.[0]?.path,
        req.files.studentSignature?.[0]?.path,
        req.files.parentGuardianSignature?.[0]?.path,
      ].filter(Boolean) as string[];
      console.log('Cleaning up files:', filePaths);
      await Promise.all(
        filePaths.map(async (path) => {
          try {
            await fs.unlink(path);
          } catch (err) {
            console.error(`Failed to delete file ${path}:`, err);
          }
        })
      );
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
    }));

    res.status(200).json(responseAdmissions);
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
    };

    res.status(200).json(responseAdmission);
  } catch (error) {
    console.error('Error in getAdmissionById:', error);
    return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};