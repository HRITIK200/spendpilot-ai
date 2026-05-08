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

    return {
      ...tool,
      optimizedPlan,
      recommendation,
      reasoning,
      monthlySavings: savings,
      annualSavings: savings * 12,
    };
  });

  // Optimization score

  const optimizationScore = Math.max(
    100 - totalMonthlySavings,
    65
  );

  return {
    auditedTools,
    totalMonthlySavings,
    totalAnnualSavings:
      totalMonthlySavings * 12,
    optimizationScore,
  };
};