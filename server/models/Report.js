import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    auditedTools: Array,

    totalMonthlySavings: Number,

    totalAnnualSavings: Number,

    optimizationScore: Number,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    company: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;