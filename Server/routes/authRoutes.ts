import { Router, Request, Response } from "express";
import { register, login } from "../controllers/authController";
import { UserRole, PERMISSIONS } from "../types/roles";
import { authenticateUser } from "../middleware/rbacMiddleware";
import { AuthRequest } from "../types/roles";

const router = Router();


router.post("/register", register);
router.post("/login", login);

// Protected routes examples
// router.get(
//   "/admin/users",
//   authenticateUser,
//   hasRole(['warden']),
// );

// router.post(
//   "/admission/approve",
//   authenticateUser,
//   hasRole(['warden', 'rc']),
//   hasPermission('approve_admission'),
// );

/**
 * Route to verify the token and return user information
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with user information if token is valid
 */
router.get("/verify-token", authenticateUser, (req: AuthRequest, res: Response) => {
  if (req.User) {
    res.status(200).json({
      success: true,
      message: "Token is valid",
      user: req.User
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});



export default router;