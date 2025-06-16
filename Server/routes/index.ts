import { Router, Request, Response } from "express";
import authRouter from "./authRoutes";
import studentRouter from "./studentRoutes";
import managerRouter from "./managerRoutes";
import rcRouter from "./rcRoutes";
import deputyWardenRouter from "./deputyWardenRoutes";
import { UserRole, PERMISSIONS } from "../types/roles";
import { authenticateUser } from "../middleware/rbacMiddleware";
// import { generatePdf, PDFData } from "../utils/pdfGenerator"; // Uncomment if you want to use the PDF generation route

const routes = Router();

routes.use("/", authRouter);
routes.use("/api/student/", studentRouter);
routes.use("/api/manager/", managerRouter);
routes.use("/api/resident_counsellor/",rcRouter);
routes.use("/api/deputy_warden/",deputyWardenRouter);

routes.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// // Test route for PDF generation
// routes.post("/check", async (req: Request, res: Response) => {
//   try {
//     const { templateName, data } = req.body;

//     if (!templateName || !data) {
//       return res.status(400).json({
//         error: "Template name and data are required",
//       });
//     }

//     const pdfBuffer = await generatePdf(templateName, data as PDFData);

//     res.contentType("application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       'attachment; filename="test-generated.pdf"'
//     );
//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error("Error in PDF test route:", error);
//     res.status(500).json({
//       error: "Failed to generate PDF",
//       details: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error),
//     });
//   }
// });



routes.get(/^\/.*/, (req: Request, res: Response) => {
  res.send("👋 Welcome to Anna Oasis API!");
});

export default routes;
