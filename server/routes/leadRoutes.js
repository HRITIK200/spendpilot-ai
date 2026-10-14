import express from "express";
import { validateRequest } from "../middleware/validation.js";
import { leadSchema } from "../middleware/schemas.js";
import { createLead } from "../controllers/leadController.js";

const router = express.Router();

// Save lead & dispatch subscription confirmation email
router.post("/", validateRequest(leadSchema), createLead);

export default router;