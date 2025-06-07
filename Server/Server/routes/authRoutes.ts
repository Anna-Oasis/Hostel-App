import { Router } from "express";
import { register, login } from "../controllers/authController";
import { authenticateUser, hasRole, hasPermission } from "../middleware/rbacMiddleware";

const router = Router();


router.post("/register", register);
router.post("/login", login);

// Protected routes examples
// router.get(
//   "/admin/users",
//   authenticateUser,
//   hasRole(['admin']),
// );

// router.post(
//   "/admission/approve",
//   authenticateUser,
//   hasRole(['admin', 'rc']),
//   hasPermission('approve_admission'),
// );


export default router;