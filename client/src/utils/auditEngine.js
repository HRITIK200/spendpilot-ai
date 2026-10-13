export const generateAudit = (tools) => {

  let totalMonthlySavings = 0;

  const auditedTools = tools.map((tool) => {

    let recommendation =
      "Current plan looks optimized.";

    let savings = 0;

    let optimizedPlan = tool.plan;

    let reasoning =
      "Your current setup appears cost-efficient.";

    // RULE 1
    // Small teams using Team plans

    if (
      tool.plan === "Team" &&
      Number(tool.seats) <= 2
    ) {

      optimizedPlan = "Plus";

      savings = 10 * Number(tool.seats);

      recommendation =
        "Downgrade to Plus plan";

      reasoning =
        "Small teams typically do not require collaboration-focused Team plans.";
    }

    // RULE 2
    // Enterprise overkill

    if (
      tool.plan === "Enterprise" &&
      Number(tool.seats) < 10
    ) {

      optimizedPlan = "Business";

      savings = 20 * Number(tool.seats);

      recommendation =
        "Business plan may be more cost-efficient";

      reasoning =
        "Enterprise pricing is usually better suited for larger organizations.";
    }

    // RULE 3
    // Coding workflow mismatch

    if (
      tool.useCase === "coding" &&
      tool.tool === "ChatGPT"
    ) {

      recommendation =
        "Consider Cursor or GitHub Copilot";

      reasoning =
        "Development-focused AI tools may provide better coding workflow efficiency.";
    }

    totalMonthlySavings += savings;

    // RULE 4: Ghost Seat & Utilization Idle Waste Detection
    const utilPct = tool.utilization !== undefined ? Number(tool.utilization) : 100;
    let ghostSeats = 0;
    let ghostSeatMonthlyWaste = 0;

    if (utilPct < 100 && Number(tool.seats) > 1) {
      ghostSeats = Math.max(1, Math.round(Number(tool.seats) * (1 - utilPct / 100)));
      const unitPrice = Number(tool.monthlyCost) || (tool.seats ? Math.round(savings > 0 ? (savings / tool.seats) : 20) : 20);
      ghostSeatMonthlyWaste = ghostSeats * unitPrice;
    }

    return {
      ...tool,
      optimizedPlan,
      recommendation,
      reasoning,
      utilization: utilPct,
      ghostSeats,
      ghostSeatMonthlyWaste,
      monthlySavings: savings,
      annualSavings: savings * 12,
    };
  });

  // Calculate global ghost seat metrics
  const ghostSeatsTotal = auditedTools.reduce((acc, t) => acc + (t.ghostSeats || 0), 0);
  const ghostSeatsWasteMonthly = auditedTools.reduce((acc, t) => acc + (t.ghostSeatMonthlyWaste || 0), 0);
  const ghostSeatAlerts = auditedTools
    .filter((t) => t.ghostSeats > 0)
    .map((t) => ({
      tool: t.tool,
      ghostSeats: t.ghostSeats,
      totalSeats: t.seats,
      monthlyWaste: t.ghostSeatMonthlyWaste,
      message: `Detected ${t.ghostSeats} dormant ${t.tool} seat${t.ghostSeats > 1 ? "s" : ""} (${Math.round((t.ghostSeats / t.seats) * 100)}% idle). Decommissioning saves $${t.ghostSeatMonthlyWaste}/mo.`,
    }));

  // Optimization score
  const optimizationScore = Math.max(
    100 - totalMonthlySavings - Math.round(ghostSeatsWasteMonthly * 0.1),
    65
  );

  return {
    auditedTools,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    optimizationScore,
    ghostSeatsTotal,
    ghostSeatsWasteMonthly,
    ghostSeatsWasteAnnual: ghostSeatsWasteMonthly * 12,
    ghostSeatAlerts,
  };
};