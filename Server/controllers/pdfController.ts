import { generatePdf } from "../services/pdfGenerationService";
import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
import { getOrCreateBillId } from "../services/billServices";
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

export async function generateFeeReceiptController(
    req : AuthRequest,
    res : Response
){
    if (!req.User || !req.User.id) {
        throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
    }

    const addmission_id = req.params.addmissionid;
    const addmission = await getAdmissionByAdmissionId(Number(addmission_id))
    const student = await findStudentByRollNo(addmission[0].roll_number)
    const billId = await getOrCreateBillId(addmission[0].roll_number)
    // console.log(billId, student,addmission)
    const templateData = buildFeeReceiptData(addmission[0], student[0], billId)
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

    const students = await findStudentByUserId(Number(req.User.id));
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

    const students = await findStudentByUserId(Number(req.User.id));
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

    const students = await findStudentByUserId(Number(req.User.id));
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
