import { generatePdf } from "../services/pdfGenerationService";
import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
import { getOrCreateBillId, getOrCreateBillIdByAdmissionId, getOrCreateBillIdByFeePaymentId } from "../services/billServices";
import { findStudentByRollNo, findStudentByUserId } from "../services/detailsService";
import { getAdmissionByAdmissionId, getAdmissionByRollNumber } from "../services/admissionServices";
import { fillHtmlTemplate } from "../services/htmlTemplateService";
import { generatePdfFromHtml } from "../services/htmlPdfGenerationService";
import {
    buildApplicationFormData,
    buildFeeReceiptData,
    buildReAdmissionFormData,
    buildRoomAllotmentFormData,
} from "../services/studentFormsService";
import { getAdmissionSessionIdByAcademicYear } from "../services/admissionSessionServices";

export async function generateFeeReceiptController(
    req : AuthRequest,
    res : Response
){
    if (!req.User || !req.User.id) {
        throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
    }

    const feePayment_id = Number(req.query.feePayment_id);
    const admission_id = Number(req.params.admissionId);

    const admission = await getAdmissionByAdmissionId(Number(admission_id))
    const student = await findStudentByRollNo(admission[0].roll_number)
    const session = await getAdmissionSessionIdByAcademicYear(admission[0].academicYear)
    let billId;
    if(feePayment_id){
        billId = await getOrCreateBillIdByFeePaymentId(admission[0].roll_number, session[0].id, feePayment_id)
    }
    else{
        billId = await getOrCreateBillIdByAdmissionId(admission[0].roll_number, session[0].id, admission_id)
    }

    // console.log(billId, student,addmission)
    const templateData = buildFeeReceiptData(admission[0], student[0], billId)
    const html = fillHtmlTemplate("fee-receipt", templateData)
    
    const pdfBuffer = await generatePdfFromHtml(html)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="fee-receipt.pdf"'
    );
    
    res.end(pdfBuffer);
}

export async function generateApplicationFormController(
    req: AuthRequest,
    res: Response
) {
    if (!req.User || !req.User.id) {
        throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
    }
    let id;
    if(req.User.role === "manager"){
        console.log("Manager Requested Application Form")
        id = req.params.studentId;
        console.log(id)
    }
    else{
        console.log("Student Requested Application Form")
        id = req.User.id
    }
    const students = await findStudentByUserId(Number(id));
    const student = students[0];

    if (!student) {
        throw AppError("Student details not found", httpStatus.NOT_FOUND);
    }

    const admissions = await getAdmissionByRollNumber(student.rollNo);
    const latestAdmission = admissions.sort(
        (first, second) =>
            new Date(second.submission_Date).getTime() -
            new Date(first.submission_Date).getTime()
    )[0];

    if(latestAdmission.previousResident){
        throw AppError("Application form is for new Students Only", httpStatus.FORBIDDEN);
    }

    const templateData = buildApplicationFormData(student, latestAdmission);
    const html = fillHtmlTemplate("application-form", templateData);
    const pdfBuffer = await generatePdfFromHtml(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="application-form.pdf"'
    );

    res.end(pdfBuffer);
}

export async function generateRoomAllotmentFormController(
    req: AuthRequest,
    res: Response
) {
    if (!req.User || !req.User.id) {
        throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
    }

    let id;
    if(req.User.role === "manager"){
        console.log("Manager Requested Application Form")
        id = req.params.studentId;
        console.log(id)
    }
    else{
        console.log("Student Requested Application Form")
        id = req.User.id
    }

    const students = await findStudentByUserId(Number(id));
    const student = students[0];

    if (!student) {
        throw AppError("Student details not found", httpStatus.NOT_FOUND);
    }

    const templateData = buildRoomAllotmentFormData(student);
    const html = fillHtmlTemplate("room-allotment-form", templateData);
    const pdfBuffer = await generatePdfFromHtml(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="room-allotment-form.pdf"'
    );

    res.end(pdfBuffer);
}

export async function generateReAdmissionFormController(
    req: AuthRequest,
    res: Response
) {
    if (!req.User || !req.User.id) {
        throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
    }

    let id;
    if(req.User.role === "manager"){
        console.log("Manager Requested Application Form")
        id = req.params.studentId;
        console.log(id)
    }
    else{
        console.log("Student Requested Application Form")
        id = req.User.id
    }

    const students = await findStudentByUserId(Number(id));
    const student = students[0];

    if (!student) {
        throw AppError("Student details not found", httpStatus.NOT_FOUND);
    }

    const admissions = await getAdmissionByRollNumber(student.rollNo);
    const latestAdmission = admissions.sort(
        (first, second) =>
            new Date(second.submission_Date).getTime() -
            new Date(first.submission_Date).getTime()
    )[0];

    if(!latestAdmission.previousResident){
        throw AppError("Readmission form is for only new admissions", httpStatus.FORBIDDEN);
    }

    const templateData = buildReAdmissionFormData(student, latestAdmission);
    const html = fillHtmlTemplate("re-admission-form", templateData);
    const pdfBuffer = await generatePdfFromHtml(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="re-admission-form.pdf"'
    );

    res.end(pdfBuffer);
}
