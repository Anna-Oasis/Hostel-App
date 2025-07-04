// authRoutes.ts - Authentication-related routes for the Hostel App API
// Handles user registration, login, and token verification

import { Router, Response } from "express";
import { register, login } from "../controllers/authController";
import { authenticateUser } from "../middleware/rbacMiddleware";
import { AuthRequest } from "../types/roles";

const router = Router();

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   GET /verify-token
 * @desc    Verify JWT token and return user info if valid
 * @access  Protected
 * @middleware authenticateUser - Verifies JWT and attaches user to request
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