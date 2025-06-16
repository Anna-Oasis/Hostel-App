// import { NextFunction, Request, Response } from "express";
// import { getAdmissionsApprovedByRC } from "../services/rcAdmissionApprovalService";

// export const fetchAdmissionsApprovedByRC = async (req: Request, res: Response, next: NextFunction) => {
//   const rcId = parseInt(req.params.rc_id);

//   if (isNaN(rcId)) {
//     return res.status(400).json({ success: false, message: "Invalid RC ID" });
//   }

//   try {
//     const data = await getAdmissionsApprovedByRC(rcId);
//     res.status(200).json({ success: true, data });
//   } catch (error) {
//     console.error("Error fetching admissions for RC:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
