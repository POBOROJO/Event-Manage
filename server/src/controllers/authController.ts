import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { signUpValidation } from "../schemas/signUpSchema";
import { signInValidation } from "../schemas/signInSchema";
import dotenv from "dotenv";

dotenv.config();

//Register
export const register = async (req: Request, res: Response) => {
  const validation = signUpValidation.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.errors);
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: "user",
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).send("Server error");
  }
};

//Login
export const login = async (req: Request, res: Response) => {
  const validation = signInValidation.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.errors);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    const payload = {
      user: {
        id: user.id,
        role: "user",
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error: any) {
    console.error("Error:", error.message);
    return res.status(500).send("Server error");
  }
};

//Guest Login
export const guestLogin = async (req: Request, res: Response) => {
  const validation = signInValidation.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.errors);
  }
  const payload = {
    user: {
      id: null,
      role: "guest",
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
};

//Logout
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Logged out successfully" });
};
