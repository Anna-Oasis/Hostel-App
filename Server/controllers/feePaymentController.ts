import { createFeePaymentService, findStudentByUserId, getLatestAdmissionByRollNumber, getLatestAdmissionForAcademicYear } from "../services/feePaymentServices";
import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { feePaymentSchema } from "../validation/admission.schema";
import { getLatestDeclaration } from "../services/declarationServices";
import { declaration, feePaymentStatus } from "../constants/enum";
import { handleFileUpload } from "../services/cloudflare/fileUpload";
import { Response } from "express";
import { getLatestAdmissionSessionForSemesterService } from "../services/admissionSessionServices";

export async function createFeePaymentController(req: AuthRequest, res: Response) : Promise<void> {
  const userId = req.User?.id;
  const userRole = req.User?.role;

  if (!userId || !userRole) {
    throw AppError("Unauthorized access", httpStatus.UNAUTHORIZED);
  }

  // Only students can access this route
  if (userRole !== "student") {
    throw AppError("Only students can submit admission forms", httpStatus.FORBIDDEN);
  }

  // Get student details using authenticated user's ID
  const studentData = await findStudentByUserId(Number(userId));
  // console.log("Student Data:", studentData);
  if (!studentData) {
    throw AppError("Student record not found", httpStatus.NOT_FOUND);
  }

  if (!studentData.approve) {
    throw AppError("Student is not approved", httpStatus.BAD_REQUEST);
  }
  req.body.studentAgreed = req.body.studentAgreed === "true"
  req.body.parentAgreed = req.body.parentAgreed === "true"
  req.body.previousResident = req.body.previousResident === "true"

  const admissionId = await getLatestAdmissionByRollNumber(studentData.rollNo)
  // Attach roll_number to the request body
  const feePaymentData = {
    ...req.body,
    roll_number: studentData.rollNo,
    admissionId : admissionId.id,
  };

  const parsedData = feePaymentSchema.parse(feePaymentData);


  const declaration_latest = await getLatestDeclaration(declaration.ADMISSION);

  // Handle file upload if present
  let transactionPhotoUrl: string | undefined;
  if (req.file) {
    transactionPhotoUrl = await handleFileUpload(req.file, parsedData.roll_number, "feePayment", "transaction");
  }

  const newFeePayment = await createFeePaymentService({
    ...parsedData,
    declaration_id: declaration_latest[0].id,
    status: feePaymentStatus.SUBMITTED,
    submission_Date: new Date(),
    updatedAt: new Date(),
    transactionPhotoUrl,
  });

  res.status(200).json({
    success: true,
    data: newFeePayment,
    message: "FeePayment created successfully",
  });
}


export async function checkFeePaymentEligibilityForSemesterController(req: AuthRequest, res: Response) {
  const semester = Number(req.params.semester);
  const {roll_number} = req.query
  if (isNaN(semester)) {
    throw AppError("Invalid semester", httpStatus.BAD_REQUEST);
  }
  try {
    const session = await getLatestAdmissionSessionForSemesterService(semester);
    
    let isOpen = false;
    if (session) {
      const latestAdmission = await getLatestAdmissionForAcademicYear(String(roll_number), session.academic_year)
      const currentDate = new Date();
      // Parse as local date at midnight
      const fromDate = new Date(session.from + "T00:00:00");
      const toDate = new Date(session.to + "T23:59:59");
      
      isOpen = !latestAdmission  && currentDate >= fromDate && currentDate <= toDate;
    }
    
    res.status(httpStatus.OK).json({
      success: true,
      data: session || null,
      isOpen : isOpen,
      message: session
        ? "Fetched latest active admission session successfully"
        : "No active Fee Payment Service found for the given semester",
    });
  } catch (err) {
    console.error("Error fetching latest admission session:", err);
    throw AppError(
      "Failed to fetch admission session",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
}