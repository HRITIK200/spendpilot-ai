const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    auditedTools: Array,

    totalMonthlySavings: Number,

    totalAnnualSavings: Number,

    optimizationScore: Number,
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Report", reportSchema);