import { generatePdf } from "../services/pdfGenerationService";
import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
import { getOrCreateBillId } from "../services/billServices";
export async function generateFeeReceiptController(
    req : AuthRequest,
    res : Response
){
    if (!req.User || !req.User.id) {
        throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
    }

    const {data} = req.body;

    const billId = await getOrCreateBillId(data["rollNo"])
    console.log(billId)
    
    const pdfData = {
        ...data,
        "dateOfGeneration" : new Date().toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                            }),
        "billId" : billId
    }

    const pdfBuffer = await generatePdf("fee-receipt", pdfData)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="fee-receipt.pdf"'
    );

    res.end(pdfBuffer);
}