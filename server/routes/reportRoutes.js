const express = require("express");

const router = express.Router();

const Report = require("../models/Report");


// CREATE REPORT

router.post("/", async (req, res) => {

  try {

    const report =
      await Report.create(req.body);

    res.status(201).json(report);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// GET REPORT BY ID

router.get("/:id", async (req, res) => {

  try {

    const report =
      await Report.findById(req.params.id);

    res.json(report);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;