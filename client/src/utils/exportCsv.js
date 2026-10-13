/**
 * SpendPilot AI - Enterprise CSV Export Engine
 * Generates RFC 4180 compliant CSV exports for FinOps teams, finance leads, and CFOs.
 */

/**
 * Escapes fields for CSV format
 */
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Generates CSV string from an audit results object
 */
export function generateAuditCsv(results) {
  if (!results) {
    throw new Error("Invalid results object provided for CSV generation");
  }

  const breakdown = results.breakdown || [];
  const generatedAt = new Date().toLocaleString();

  // Top FinOps Metadata Summary Block
  const lines = [
    "SPENDPILOT AI - ENTERPRISE AI SAAS FINOPS AUDIT REPORT",
    `Generated At,${escapeCsv(generatedAt)}`,
    `Audit ID,${escapeCsv(results._id || "SP-" + Date.now())}`,
    `Optimization Score,${escapeCsv((results.optimizationScore || 0) + "/100")}`,
    `Total Current Monthly Spend,${escapeCsv("$" + (results.totalMonthlySpend || 0))}`,
    `Total Optimized Monthly Spend,${escapeCsv("$" + (results.optimizedMonthlySpend || 0))}`,
    `Projected Monthly Savings,${escapeCsv("$" + (results.totalMonthlySavings || 0))}`,
    `Projected Annual Savings,${escapeCsv("$" + (results.totalAnnualSavings || 0))}`,
    "", // Blank separator
    // Table Header
    [
      "Tool Name",
      "Category",
      "Current Plan",
      "Active Seats",
      "Unit Cost ($/mo)",
      "Current Monthly Spend ($)",
      "Current Annual Spend ($)",
      "Optimized Plan",
      "Optimized Unit Cost ($)",
      "Optimized Monthly Spend ($)",
      "Monthly Savings ($)",
      "Annual Savings ($)",
      "Action Status",
      "Recommendation",
    ].join(","),
  ];

  // Tool Breakdown Rows
  breakdown.forEach((tool) => {
    const unitCost = Number(tool.unitCost) || (tool.seats ? Math.round(tool.currentCost / tool.seats) : 0);
    const currentCost = Number(tool.currentCost) || 0;
    const optimizedCost = Number(tool.optimizedCost) || 0;
    const monthlySavings = Number(tool.monthlySavings) || 0;
    const annualSavings = monthlySavings * 12;
    const optUnitCost = Number(tool.optimizedUnitCost) || (tool.seats ? Math.round(optimizedCost / tool.seats) : 0);

    const row = [
      escapeCsv(tool.name),
      escapeCsv(tool.category || "AI Tool"),
      escapeCsv(tool.currentPlan || "Current Tier"),
      tool.seats || 1,
      unitCost,
      currentCost,
      currentCost * 12,
      escapeCsv(tool.optimizedPlan || tool.currentPlan),
      optUnitCost,
      optimizedCost,
      monthlySavings,
      annualSavings,
      escapeCsv(monthlySavings > 0 ? "Optimization Available" : "Optimized"),
      escapeCsv(tool.reason || "Maintain current subscription"),
    ];

    lines.push(row.join(","));
  });

  // Summary Row
  lines.push("");
  lines.push(
    [
      "TOTALS",
      "",
      "",
      breakdown.reduce((sum, t) => sum + (Number(t.seats) || 0), 0),
      "",
      results.totalMonthlySpend || 0,
      (results.totalMonthlySpend || 0) * 12,
      "",
      "",
      results.optimizedMonthlySpend || 0,
      results.totalMonthlySavings || 0,
      results.totalAnnualSavings || 0,
      "",
      "",
    ].join(",")
  );

  return lines.join("\r\n");
}

/**
 * Initiates browser download of the generated CSV file
 */
export function downloadAuditCsv(results, filename = "SpendPilot_AI_FinOps_Audit.csv") {
  const csvContent = generateAuditCsv(results);
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
