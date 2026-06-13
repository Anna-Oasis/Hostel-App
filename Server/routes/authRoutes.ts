// authRoutes.ts - Authentication-related routes for the Hostel App API
// Handles user registration, login, and token verification

import { Router, Response } from "express";
import { register, login, forgotPassword, verifyOtp, resetPassword } from "../controllers/authController";
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

/**
 * @route   POST /forgot-password
 * @desc    Check user existence, generate 6-digit OTP, store in Valkey, and email it
 * @access  Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   POST /verify-otp
 * @desc    Verify the 6-digit OTP from Valkey and issue a short-lived reset JWT
 * @access  Public
 */
router.post("/verify-otp", verifyOtp);

/**
 * @route   POST /reset-password
 * @desc    Verify short-lived reset JWT and update password in PostgreSQL via Drizzle
 * @access  Public (Protected by temporary Bearer Token in headers)
 */
router.post("/reset-password", resetPassword);

export default router;