import { generatePdf } from "../services/pdfGenerationService";
import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
export async function generateFeeReceiptController(
    req : AuthRequest,
    res : Response
){
    if (!req.User || !req.User.id) {
        throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
    }

    const {data} = req.body;
    
    const pdfData = {
        ...data,
        "dateOfGeneration" : new Date().toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                            })
    }

    const pdfBuffer = await generatePdf("fee-receipt", pdfData)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="fee-receipt.pdf"'
    );

    res.end(pdfBuffer);
}