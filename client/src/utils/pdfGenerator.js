import jsPDF from "jspdf";

/**
 * SpendPilot AI - Certified FinOps PDF Report Generator
 * Generates an executive-ready, high-resolution PDF audit report.
 */
export function generateCertifiedPdfReport({
  reportTitle = "AI FinOps & Tooling Optimization Audit",
  companyName = "Engineering Organization",
  repoName = null,
  totalMonthlySpend = 0,
  totalAnnualSpend = 0,
  totalMonthlySavings = 0,
  totalAnnualSavings = 0,
  optimizationScore = 85,
  tools = [],
  ghostSeatsTotal = 0,
  ghostSeatsWasteMonthly = 0,
  modelWarnings = [],
  date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // Helper colors
  const primaryBlue = [37, 99, 235]; // #2563eb
  const darkBg = [15, 23, 42]; // #0f172a
  const textDark = [30, 41, 59]; // #1e293b
  const textGray = [100, 116, 139]; // #64748b
  const emeraldGreen = [16, 185, 129]; // #10b981
  const amberOrange = [245, 158, 11]; // #f59e0b

  let y = margin;

  // 1. TOP HEADER BRANDING BANNER
  doc.setFillColor(...darkBg);
  doc.roundedRect(margin, y, contentWidth, 70, 8, 8, "F");

  // Logo / Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("SPENDPILOT AI", margin + 18, y + 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("CERTIFIED DEVELOPER FINOPS INTELLIGENCE AUDIT", margin + 18, y + 48);

  // Date and Badge on Right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...emeraldGreen);
  doc.text("CERTIFIED AUDIT", pageWidth - margin - 18, y + 30, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(date, pageWidth - margin - 18, y + 46, { align: "right" });

  y += 85;

  // 2. AUDIT SUBJECT & METADATA
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...textDark);
  doc.text(reportTitle, margin, y);

  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...textGray);
  const orgSubtext = repoName 
    ? `Target Codebase: ${repoName} | Organization: ${companyName}`
    : `Prepared for: ${companyName}`;
  doc.text(orgSubtext, margin, y);

  y += 24;

  // 3. EXECUTIVE KPI METRICS (4 Metric Cards)
  const cardWidth = (contentWidth - 18) / 4;
  const cardHeight = 54;

  const metrics = [
    { label: "MONTHLY SPEND", value: `$${Number(totalMonthlySpend).toLocaleString()}/mo`, color: primaryBlue },
    { label: "PROJECTED SAVINGS", value: `+$${Number(totalMonthlySavings).toLocaleString()}/mo`, color: emeraldGreen },
    { label: "ANNUALIZED ROI", value: `$${Number(totalAnnualSavings).toLocaleString()}/yr`, color: emeraldGreen },
    { label: "OPTIMIZATION SCORE", value: `${optimizationScore}/100`, color: optimizationScore >= 80 ? emeraldGreen : amberOrange },
  ];

  metrics.forEach((m, i) => {
    const cardX = margin + i * (cardWidth + 6);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 6, 6, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...textGray);
    doc.text(m.label, cardX + 10, y + 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...m.color);
    doc.text(m.value, cardX + 10, y + 38);
  });

  y += cardHeight + 24;

  // 4. DETAILED TOOL-BY-TOOL BREAKDOWN TABLE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...textDark);
  doc.text("Tool Inventory & FinOps Right-Sizing Analysis", margin, y);

  y += 12;

  // Table Header
  doc.setFillColor(...primaryBlue);
  doc.roundedRect(margin, y, contentWidth, 22, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("TOOL & CATEGORY", margin + 10, y + 14);
  doc.text("CURRENT PLAN", margin + 140, y + 14);
  doc.text("SEATS", margin + 225, y + 14);
  doc.text("MONTHLY COST", margin + 275, y + 14);
  doc.text("RECOMMENDED PLAN", margin + 360, y + 14);
  doc.text("MONTHLY SAVINGS", margin + 465, y + 14);

  y += 24;

  // Table Rows
  tools.forEach((tool, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, 24, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...textDark);
    doc.text(tool.tool || "Unknown Tool", margin + 10, y + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...textGray);
    doc.text(tool.plan || "Standard", margin + 140, y + 15);
    doc.text(`${tool.seats || 1}`, margin + 230, y + 15);
    
    const cost = Number(tool.monthlyCost || 0) * Number(tool.seats || 1);
    doc.text(`$${cost.toLocaleString()}`, margin + 275, y + 15);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...(tool.optimizedPlan && tool.optimizedPlan !== tool.plan ? primaryBlue : textDark));
    doc.text(tool.optimizedPlan || tool.plan || "Optimized", margin + 360, y + 15);

    const savings = Number(tool.monthlySavings || 0);
    doc.setTextColor(...(savings > 0 ? emeraldGreen : textGray));
    doc.text(savings > 0 ? `+$${savings}/mo` : "$0", margin + 465, y + 15);

    // Subtle bottom border
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 24, margin + contentWidth, y + 24);

    y += 26;

    // Check page overflow
    if (y > pageHeight - 160) {
      doc.addPage();
      y = margin;
    }
  });

  y += 14;

  // 5. GHOST SEAT & DORMANT LICENSE FINDINGS
  if (ghostSeatsTotal > 0 || ghostSeatsWasteMonthly > 0) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, y, contentWidth, 42, 6, 6, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(225, 29, 72); // rose-600
    doc.text("GHOST SEAT & UTILIZATION WASTE IDENTIFIED", margin + 12, y + 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Detected ${ghostSeatsTotal} idle/unallocated seats across active licenses, resulting in $${Number(ghostSeatsWasteMonthly).toLocaleString()}/month in recoverable waste ($${Number(ghostSeatsWasteMonthly * 12).toLocaleString()}/year).`,
      margin + 12,
      y + 30
    );

    y += 52;
  }

  // 6. MODEL MIGRATION ADVISORIES
  if (modelWarnings && modelWarnings.length > 0) {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(253, 230, 138);
    const boxHeight = 22 + modelWarnings.length * 14;
    doc.roundedRect(margin, y, contentWidth, boxHeight, 6, 6, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text("ACTIONABLE MODEL MIGRATION ADVISORIES", margin + 12, y + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 53, 15);

    modelWarnings.forEach((w, idx) => {
      doc.text(`* ${w.model}: ${w.warning}`, margin + 12, y + 28 + idx * 13);
    });

    y += boxHeight + 14;
  }

  // 7. EXECUTIVE FOOTER & VERIFICATION WATERMARK
  const footerY = pageHeight - margin - 20;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY, margin + contentWidth, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textGray);
  doc.text(
    "SpendPilot AI - Certified AI FinOps Intelligence Platform | Report generated via heuristic rule-based optimization engine.",
    margin,
    footerY + 12
  );
  doc.text(`Page 1 of 1`, pageWidth - margin, footerY + 12, { align: "right" });

  // Save the document
  const fileName = `SpendPilot-FinOps-Report-${Date.now().toString().slice(-6)}.pdf`;
  doc.save(fileName);
  return fileName;
}
