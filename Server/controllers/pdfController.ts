import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
import { getOrCreateBillId } from "../services/billServices";
import { findStudentByUserId } from "../services/detailsService";
import {
    getAdmissionByAdmissionId,
    getAdmissionByRollNumber,
} from "../services/admissionServices";
import { fillHtmlTemplate } from "../services/htmlTemplateService";
import { generatePdfFromHtml } from "../services/htmlPdfGenerationService";
import {
    buildApplicationFormData,
    buildFeeReceiptData,
    buildReAdmissionFormData,
    buildRoomAllotmentFormData,
} from "../services/studentFormsService";

export async function generateFeeReceiptController(
    req: AuthRequest,
    res: Response
) {
    if (!req.User || !req.User.id) {
        throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
    }

    const { admissionId } = req.params;
    if (!admissionId || isNaN(Number(admissionId))) {
        throw AppError("Invalid or missing admission ID", httpStatus.BAD_REQUEST);
    }

    const students = await findStudentByUserId(Number(req.User.id));
    const student = students[0];

    if (!student) {
        throw AppError("Student details not found", httpStatus.NOT_FOUND);
    }

    const admissions = await getAdmissionByAdmissionId(Number(admissionId));
    const admission = admissions[0];

    if (!admission || admission.roll_number !== student.rollNo) {
        throw AppError("Admission record not found", httpStatus.NOT_FOUND);
    }

    const billId = await getOrCreateBillId(student.rollNo);
    const templateData = buildFeeReceiptData(student, admission, billId);
    const html = fillHtmlTemplate("fee-receipt", templateData);
    const pdfBuffer = await generatePdfFromHtml(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        'inline; filename="fee-receipt.pdf"'
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
        'inline; filename="application-form.pdf"'
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
        'inline; filename="room-allotment-form.pdf"'
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
        'inline; filename="re-admission-form.pdf"'
    );

    res.end(pdfBuffer);
}
