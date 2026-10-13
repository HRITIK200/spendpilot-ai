import { describe, it, expect } from "vitest";
import { generateAuditCsv } from "./exportCsv";

describe("exportCsv utility", () => {
  it("generates a formatted CSV string with headers and totals", () => {
    const mockResults = {
      _id: "test-audit-123",
      totalMonthlySpend: 500,
      optimizedMonthlySpend: 350,
      totalMonthlySavings: 150,
      totalAnnualSavings: 1800,
      optimizationScore: 78,
      breakdown: [
        {
          name: "Cursor",
          category: "Coding Assistant",
          currentPlan: "Pro",
          seats: 10,
          currentCost: 200,
          optimizedPlan: "Pro",
          optimizedCost: 200,
          monthlySavings: 0,
          reason: "Optimal tier",
        },
        {
          name: "ChatGPT",
          category: "AI Assistant",
          currentPlan: "Enterprise",
          seats: 5,
          currentCost: 300,
          optimizedPlan: "Team",
          optimizedCost: 150,
          monthlySavings: 150,
          reason: "Right-size to Team",
        },
      ],
    };

    const csv = generateAuditCsv(mockResults);

    expect(csv).toContain("SPENDPILOT AI - ENTERPRISE AI SAAS FINOPS AUDIT REPORT");
    expect(csv).toContain('"Cursor"');
    expect(csv).toContain('"ChatGPT"');
    expect(csv).toContain("TOTALS");
    expect(csv).toContain("150");
    expect(csv).toContain("1800");
  });

  it("throws error if results is missing", () => {
    expect(() => generateAuditCsv(null)).toThrow();
  });
});
