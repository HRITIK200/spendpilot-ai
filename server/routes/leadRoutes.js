import express from "express";
import Lead from "../models/Lead.js";
import { sendLeadEmail } from "../utils/sendEmail.js";
import { validateRequest } from "../middleware/validation.js";
import { leadSchema } from "../middleware/schemas.js";

const router = express.Router();

// Save lead & dispatch subscription confirmation email
router.post("/", validateRequest(leadSchema), async (req, res) => {
  try {
    const { email, company } = req.body;

    const lead = await Lead.create({
      email,
      company: company || "",
    });

    // Send confirmation email (with fallback handling)
    const emailResult = await sendLeadEmail(email, company);

    res.status(201).json({
      lead,
      emailStatus: {
        delivered: emailResult.success,
        isSandbox: Boolean(emailResult.isSandbox),
        sandboxOwner: emailResult.sandboxOwner || null,
        provider: emailResult.provider || null,
        message: emailResult.message || null,
      },
    });
  } catch (error) {
    console.error("Failed to save lead:", error);
    res.status(500).json({
      message: "Failed to save lead",
    });
  }
});

export default router;