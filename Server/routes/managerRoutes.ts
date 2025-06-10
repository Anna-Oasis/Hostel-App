import { Router, Response, RequestHandler } from "express";
import { db } from "../config/dbConnection";
import { admissionModel } from '../models/admissionModel';
import { admissionApprovalsModel } from '../models/admissionApprovals';
import { userModel } from '../models/userModel';
import { eq, and, isNotNull, desc } from "drizzle-orm";
import { CustomRequest } from "../types/roles";

const router = Router();

const getApprovals: RequestHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  const user = req.authUser;
  if (!user || user.role !== "manager") {
    res.status(403);
    res.json({ error: "Access denied: Not a manager" });
    return;
  }

  try {
    const approvals = await db
      .select({
        admissionId: admissionModel.id,
        rollNumber: admissionModel.roll_number,
        academicYear: admissionModel.academicYear,
        parentAgreed: admissionModel.parentAgreed,
        admissionCategory: admissionModel.admissionCategory, 
        hostelBlock: admissionModel.hostelBlock,
        roomNo: admissionModel.roomNumber,
        status: admissionModel.status,
        approved: admissionApprovalsModel.approve,
        comment: admissionApprovalsModel.comment,
        timestamp: admissionApprovalsModel.timestamp,
      })
      .from(admissionApprovalsModel)
      .innerJoin(admissionModel, eq(admissionApprovalsModel.admission_id, admissionModel.id))
      .innerJoin(userModel, eq(admissionApprovalsModel.user_id, userModel.id))
      .where(
        and(
          eq(admissionApprovalsModel.user_id, user.id),
          eq(userModel.role, "manager"),
          isNotNull(admissionApprovalsModel.approve)
        )
      )
      .orderBy(desc(admissionApprovalsModel.timestamp));

    res.json(approvals);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ error: "Server error" });
  }
};

router.get("/admissions/approvals", getApprovals);

export default router;

/*SELECT
    a.id AS admission_id,
    a.roll_number,
    a.academic_year,
    a.parent_agreed,
    a.admission_category,
    a.hostel_block,
    a.room_number,
    a.status,
    aa.approve,
    aa.comment,
    aa.timestamp
FROM admission_approvals aa
JOIN admission a ON aa.admission_id = a.id
JOIN users u ON aa.user_id = u.id
WHERE
    aa.user_id = :manager_id
    AND u.role = 'manager'
    AND aa.approve IS NOT NULL
ORDER BY aa.timestamp DESC;
*/
