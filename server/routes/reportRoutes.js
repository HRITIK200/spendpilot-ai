import express from "express";

import Report from "../models/Report.js";
import { auditWithGemini } from "../utils/geminiAuditor.js";
import { validateRequest } from "../middleware/validation.js";
import { reportSchema } from "../middleware/schemas.js";

const router = express.Router();

// CREATE REPORT

router.post("/", validateRequest(reportSchema), async (req, res) => {
  try {
    let reportData;

    // Server-side audit generation if raw tools list is supplied
    if (req.body.tools && Array.isArray(req.body.tools)) {
      reportData = await auditWithGemini(req.body.tools);
    } else {
      // Fallback/backward compatibility for direct saves
      reportData = req.body;
    }

    const report = await Report.create(reportData);
    res.status(201).json(report);
  } catch (error) {
    console.error("Report creation failed:", error);
    res.status(500).json({
      message: "Failed to create report",
    });
  }
});

// GET REPORT BY ID

router.get("/:id", async (req, res) => {

  try {

    const report =
      await Report.findById(
        req.params.id
      );

    res.json(report);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch report",
    });
  }
});

export default router;