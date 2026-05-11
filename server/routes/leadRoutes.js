import express from "express";

import Lead from "../models/Lead.js";

const router = express.Router();

// Save lead
router.post("/", async (req, res) => {

  try {

    const { email, company } = req.body;


    const lead = await Lead.create({
      email,
      company,
    });

    res.status(201).json(lead);

  } catch (error) {

    res.status(500).json({
      message: "Failed to save lead",
    });
  }
});

export default router;