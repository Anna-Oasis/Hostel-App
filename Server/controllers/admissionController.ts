import { Request, Response, NextFunction } from 'express';
import { db } from '../config/dbConnection'; // Corrected import path
import { admissionModel } from '../models/admissionModel';
import { admissionSchema } from '../validation/admission.schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import { z } from 'zod';
// Interface for file uploads
interface MulterRequest extends Request {
  files?: {
    passportPhoto?: Express.Multer.File[];
    studentSignature?: Express.Multer.File[];
    parentGuardianSignature?: Express.Multer.File[];
  };
}

const ensureDate = (value: Date | string): Date => {
  return typeof value === 'string' ? new Date(value) : value;
};

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
    const validatedData = admissionSchema.parse(req.body);

    console.log('Validated admission data:', validatedData);
    // Validate file uploads

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    if (
      !req.files?.passportPhoto?.[0] ||
      !req.files?.studentSignature?.[0] ||
      !req.files?.parentGuardianSignature?.[0]
    ) {
      return res.status(400).json({ error: 'All required files must be uploaded' });
    }

    // Parse dateOfBirth to ensure it matches the model's date type
    const dateOfBirth = new Date(validatedData.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      return res.status(400).json({ error: 'Invalid dateOfBirth format' });
    }

    // Parse declaration to ensure it matches the model's jsonb type
    let declaration;
    try {
      declaration = JSON.parse(validatedData.declaration);
    } catch {
      return res.status(400).json({ error: 'Invalid declaration format; must be valid JSON' });
    }

    // Prepare admission data
    const admissionData = {
      ...validatedData,
      approval: ApprovalStatusMap.PENDING, // '1' for PENDING
      academic_year: new Date().getFullYear().toString(),
      payment_id: undefined, // Let database generate serial value
      passportPhoto: req.files.passportPhoto[0].path,
      studentSignature: req.files.studentSignature[0].path,
      parentGuardianSignature: req.files.parentGuardianSignature[0].path,
      dateOfBirth, // Use parsed date
      declaration, // Use parsed JSON
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
    const [newAdmission] = await db
      .insert(admissionModel)
      .values(admissionData)
      .returning();

    // Transform response
    const responseAdmission = {
      ...newAdmission,
      approval: Object.keys(ApprovalStatusMap).find(
        (key) => ApprovalStatusMap[key as keyof typeof ApprovalStatusMap] === newAdmission.approval
      ) || newAdmission.approval,
      dateOfBirth: ensureDate(newAdmission.dateOfBirth).toISOString(), // Convert date to string
      declaration: JSON.stringify(newAdmission.declaration), // Convert jsonb to string
    };

    console.log('Admission submitted successfully:', responseAdmission);
    res.status(201).json({
      message: 'Admission submitted successfully',
      admission: responseAdmission,
    });
  } catch (error) {
    // Clean up uploaded files if insertion fails
    if (req.files) {
      const filePaths = [
        req.files.passportPhoto?.[0]?.path,
        req.files.studentSignature?.[0]?.path,
        req.files.parentGuardianSignature?.[0]?.path,
      ].filter(Boolean) as string[];
      filePaths.forEach((path) => {
        try {
          fs.unlinkSync(path);
        } catch (err) {
          console.error(`Failed to delete file ${path}:`, err);
        }
      });
    }
    next(error);
  }
};

export const getAllAdmissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admissions = await db.select().from(admissionModel);

    // Transform response
    const responseAdmissions = admissions.map((admission) => ({
      ...admission,
      approval: Object.keys(ApprovalStatusMap).find(
        (key) => ApprovalStatusMap[key as keyof typeof ApprovalStatusMap] === admission.approval
      ) || admission.approval,
      dateOfBirth: ensureDate(admission.dateOfBirth).toISOString(),
      declaration: JSON.stringify(admission.declaration),
    }));

    console.log('Fetched admissions:', responseAdmissions);
    res.status(200).json(responseAdmissions);
  } catch (error) {
    next(error);
  }
};

export const getAdmissionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const admission = await db
      .select()
      .from(admissionModel)
      .where(eq(admissionModel.user_id, parseInt(id)))
      .limit(1);

    if (admission.length === 0) {
      return res.status(404).json({ error: 'Admission not found' });
    }

    // Transform response
    const responseAdmission = {
      ...admission[0],
      approval: Object.keys(ApprovalStatusMap).find(
        (key) => ApprovalStatusMap[key as keyof typeof ApprovalStatusMap] === admission[0].approval
      ) || admission[0].approval,
      dateOfBirth: ensureDate(admission[0].dateOfBirth).toISOString(),
      declaration: JSON.stringify(admission[0].declaration),
    };

    console.log('Fetched admission by ID:', responseAdmission);
    res.status(200).json(responseAdmission);
  } catch (error) {
    next(error);
  }
};