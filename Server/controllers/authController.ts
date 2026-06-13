import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { redisClient } from "../services/redisService";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../config/dbConnection"; 
import { userModel } from "../models/userModel"; 
import { eq } from "drizzle-orm";
import { UserRole } from "../types/roles";

const generateToken = (id: string, role: UserRole): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return jwt.sign({ id, role }, jwtSecret, {
    expiresIn: "30d",
  });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

const generateResetToken = (email: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET environment variable is not set");
  return jwt.sign({ email, purpose: "password_reset" }, jwtSecret, {
    expiresIn: "15m",
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role = "student" } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
      return;
    }

    const validRoles: UserRole[] = ["warden", "rc", "manager", "student", "deputyWarden", "executiveWarden"];
    if (!validRoles.includes(role)) {
      res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(userModel)
      .where(eq(userModel.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await db
      .insert(userModel)
      .values({
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
      })
      .returning();

    if (!newUser || newUser.length === 0) {
      throw new Error("Failed to create user");
    }

    const createdUser = newUser[0];

    res.status(201).json({
      success: true,
      data: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        token: generateToken(createdUser.id.toString(), createdUser.role as UserRole),
      },
    });
  } catch (error: any) {
    console.error("Error in /register route:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user by email
    const userResult = await db
      .select()
      .from(userModel)
      .where(eq(userModel.email, email))
      .limit(1);

    if (userResult.length === 0) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const user = userResult[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id.toString(), user.role as UserRole),
      },
    });
  } catch (error: any) {
    console.error("Error in /login route:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// A. FORGOT PASSWORD (Generate & Send OTP)
// ==========================================
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    // Check if the user exists in PostgreSQL via Drizzle
    const userResult = await db
      .select()
      .from(userModel)
      .where(eq(userModel.email, email))
      .limit(1);

    if (userResult.length === 0) {
      res.status(404).json({ success: false, message: "No hostel account found with this email" });
      return;
    }

    // Generate a secure 6-digit numeric OTP string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP in Valkey/Redis (TTL: 600 seconds = 10 minutes)
    await redisClient.setEx(`otp:${email}`, 600, otp);

    // Dispatch the email to the student
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Anna Oasis - Password Reset OTP",
      text: `Your temporary verification code is ${otp}. This code will expire in 10 minutes.`,
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent to your registered email",
    });
  } catch (error: any) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// B. VERIFY OTP (Check Database & Return JWT)
// ==========================================
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ success: false, message: "Email and OTP are required" });
      return;
    }

    // Retrieve the active OTP from Valkey/Redis
    const cachedOtp = await redisClient.get(`otp:${email}`);

    // If the 10 minutes passed, Valkey automatically deletes it, returning null
    if (!cachedOtp || cachedOtp !== otp) {
      res.status(400).json({ success: false, message: "Invalid or expired verification code" });
      return;
    }

    // Generate an isolated reset token so they can change their password safely
    const resetToken = generateResetToken(email);

    res.status(200).json({
      success: true,
      message: "Verification successful",
      resetToken,
    });
  } catch (error: any) {
    console.error("Error in verifyOtp:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// C. RESET PASSWORD (Verify Reset JWT & Save)
// ==========================================
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { newPassword } = req.body;
    const authHeader = req.headers.authorization;

    if (!newPassword) {
      res.status(400).json({ success: false, message: "New password is required" });
      return;
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Access denied: Reset token missing" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Decode and verify the structure of the temporary JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      email: string;
      purpose: string;
    };

    // Prevent active session tokens from hacking this password reset route
    if (decoded.purpose !== "password_reset") {
      res.status(403).json({ success: false, message: "Invalid token operation" });
      return;
    }

    // Hash the incoming credentials using bcryptjs
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the row in PostgreSQL via Drizzle
    await db
      .update(userModel)
      .set({ password: hashedPassword })
      .where(eq(userModel.email, decoded.email));

    // Clear the OTP key cache immediately to clean up memory footprints
    await redisClient.del(`otp:${decoded.email}`);

    res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error: any) {
    console.error("Error in resetPassword:", error.message);
    res.status(401).json({
      success: false,
      message: "Session expired or invalid. Please request a new verification code.",
    });
  }
};