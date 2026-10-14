import express from "express";
import { z } from "zod";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validation.js";
import { register, login, getMe } from "../controllers/authController.js";

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: z.string().optional().default(""),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

// REGISTER
router.post("/register", validateRequest(registerSchema), register);

// LOGIN
router.post("/login", validateRequest(loginSchema), login);

// GET CURRENT USER PROFILE
router.get("/me", verifyToken, getMe);

export default router;
