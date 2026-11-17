import nodemailer from "nodemailer";

export const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

export async function sendMail(
    email : string,
    subject : string,
    message : string
) {
    await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: subject,
          text: message,
    });
}
