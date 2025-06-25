import {z} from "zod";

export const preAdmissionSchema = z.object({
    email : z.string().email("Invalid email format"),
    name : z.string().min(1, "Name is required").max(30, "Name must be less than 30 characters"),
    country : z.string().min(1, "Country is required").max(30, "Country must be less than 30 characters"),
    nationality : z.string().min(1, "Nationality is required").max(30,  "Nationality must be less than 30 characters"),
    interestedCourse : z.string().min(1, "Interested course is required").max(30, "Interested course must be less than 30 characters"),
    interestedBranch : z.string().min(1, "Interested branch is required").max(30, "Interested branch must be less than 30 characters"),
    alternateMail : z.string().email("Invalid alternate email format").max(30, "Alternate email must be less than 30 characters"),
    whatsappNumber : z.string().regex(/^(\+\d{1,3})?\d{10}$/, "Invalid WhatsApp number format").max(15, "WhatsApp number must be less than 15 characters"),
    remarks : z.string().min(1, "Remarks are required").max(300, "Remarks must be less than 500 characters"),
})

