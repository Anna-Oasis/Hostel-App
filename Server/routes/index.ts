import { Router, Request, Response } from "express";
import authRouter from "./authRoutes";
import detailsRouter from "./detailsRoute";
import studentRouter from "./studentRoutes";
import managerRouter from "./managerRoutes";
import deputyRouter from './deputyWardenRoutes'
import rcRouter from "./rcRoutes";
import { UserRole, PERMISSIONS } from "../types/roles";
import { authenticateUser } from "../middleware/rbacMiddleware";
// import { generatePdf, PDFData } from "../utils/pdfGenerator"; // Uncomment if you want to use the PDF generation route

const routes = Router();

routes.use("/", authRouter);
routes.use("/api/details", detailsRouter);
routes.use("/api/student/", studentRouter);
routes.use("/api/manager/", managerRouter);
routes.use("/api/deputy_warden/", deputyRouter);


routes.use("/api/resident_counsellor/",rcRouter);


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


interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

/**
 * Route to verify the token and return user information
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with user information if token is valid
 */
routes.get("/verify-token", authenticateUser, (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Token is valid",
      user : req.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

routes.get(/^\/.*/, (req: Request, res: Response) => {
  res.send("👋 Welcome to Anna Oasis API!");
});

export default routes;
