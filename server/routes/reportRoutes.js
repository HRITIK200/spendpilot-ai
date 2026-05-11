import express from "express";

import Report from "../models/Report.js";

const router = express.Router();

// CREATE REPORT

router.post("/", async (req, res) => {

  try {

    const report =
      await Report.create(req.body);

    res.status(201).json(report);

  } catch (error) {

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