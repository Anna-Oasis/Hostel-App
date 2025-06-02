import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabase } from "../config/supabaseBucket";
import { UserRole } from "../types/roles";

const generateToken = (id: string, role: UserRole): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role = "student" } = req.body;

    const validRoles: UserRole[] = ["admin", "rc", "manager", "student"];
    if (!validRoles.includes(role)) {
      res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
      return;
    }

    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (findError) {
      console.error("Error checking existing user:", findError.message);
    }

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          role,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting user:", insertError.message);
      throw new Error(insertError.message);
    }

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser.id, newUser.role as UserRole),
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

    const { data: user, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (findError) {
      console.error("Error finding user:", findError.message);
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

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
        token: generateToken(user.id, user.role as UserRole),
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
