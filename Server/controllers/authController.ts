import { Request, Response } from "express";
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

    const validRoles: UserRole[] = ["warden", "rc", "manager", "student"];
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
