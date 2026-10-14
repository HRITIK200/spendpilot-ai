import express from "express";
import { z } from "zod";
import { validateRequest } from "../middleware/validation.js";
import { reportSchema } from "../middleware/schemas.js";
import { verifyToken, optionalAuth } from "../middleware/authMiddleware.js";
import {
  createReport,
  getUserHistory,
  getReportById,
  deleteReport,
  emailReport,
} from "../controllers/reportController.js";

const router = express.Router();

const emailSchema = z.object({
  recipientEmail: z.string().email("A valid recipient email is required").trim().toLowerCase(),
  senderName: z.string().optional().default("FinOps Lead"),
  notes: z.string().optional().default(""),
});

// 1. CREATE REPORT (Guest or Authenticated User)
router.post("/", optionalAuth, validateRequest(reportSchema), createReport);

// 2. GET USER AUDIT HISTORY (Authenticated Cloud Sync)
router.get("/user/history", verifyToken, getUserHistory);

// 3. GET REPORT BY ID (Public or Private)
router.get("/:id", getReportById);

// 4. DELETE REPORT (Authenticated Owner)
router.delete("/:id", verifyToken, deleteReport);

// 5. EMAIL REPORT TO FINANCE / EXECUTIVE (Resend API)
router.post("/:id/email", validateRequest(emailSchema), emailReport);

export default router;