import { Router, Request, Response } from 'express';
import { db } from '../config/dbConnection';  
import { admissionApprovalsModel } from '../models/admissionApprovals';
import { admissionModel } from '../models/admissionModel';
import { userModel } from '../models/userModel';
import { desc } from 'drizzle-orm';

const router: Router = Router();

router.get("/admissions/approval", async (req: Request, res: Response): Promise<void> => {
  try {
    const approvals = await db
      .select()
      .from(admissionApprovalsModel)
      .orderBy(desc(admissionApprovalsModel.timestamp));

    res.status(200);
    res.json(approvals);
  } catch (error) {

    res.status(500);
    res.json({ error: 'Failed to fetch' });
  }
});



export default router;
