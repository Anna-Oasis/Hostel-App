import { Router } from "express";
import { validateJWT } from "../middleware/jwt";
import { ManagerController } from "../controllers/managerController";

const router = Router();
const managerController = new ManagerController();

router.get("/admissions/approvals", validateJWT, managerController.getAdmissionApprovals.bind(managerController));
router.put("/grievance/:id", validateJWT, managerController.resolveGrievance.bind(managerController));
router.get("/grievance", validateJWT, managerController.getGrievances.bind(managerController));

export default router;


//update greivancesModel set resolved=true where greivancesmodel.id=greivance_id

