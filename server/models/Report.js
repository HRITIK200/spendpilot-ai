import mongoose from "mongoose";

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

const Report =
  mongoose.model(
    "Report",
    reportSchema
  );

export default Report;