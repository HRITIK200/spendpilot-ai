import { describe, it, expect, beforeEach } from "vitest";
import { getAuditHistory, saveAuditToHistory, clearAuditHistory, computeAuditDiff } from "./auditHistory";

describe("auditHistory utility", () => {
  beforeEach(() => {
    clearAuditHistory();
  });

  it("saves and retrieves audit snapshots", () => {
    expect(getAuditHistory()).toEqual([]);

    const snapshot = {
      id: "audit-1",
      companyName: "Acme Corp",
      totalMonthlySpend: 1500,
      totalMonthlySavings: 350,
      optimizationScore: 88,
      tools: [{ tool: "Cursor", plan: "Pro" }],
    };

    saveAuditToHistory(snapshot);
    const history = getAuditHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe("audit-1");
    expect(history[0].companyName).toBe("Acme Corp");
    expect(history[0].totalMonthlySpend).toBe(1500);
  });

  it("computes accurate diff between two audits", () => {
    const auditOld = {
      id: "audit-old",
      totalMonthlySpend: 2000,
      totalMonthlySavings: 200,
      optimizationScore: 75,
      ghostSeatsTotal: 5,
      tools: [
        { tool: "ChatGPT", plan: "Team" },
        { tool: "GitHub Copilot", plan: "Business" },
      ],
    };

    const auditNew = {
      id: "audit-new",
      totalMonthlySpend: 1400,
      totalMonthlySavings: 600,
      optimizationScore: 92,
      ghostSeatsTotal: 0,
      tools: [
        { tool: "Cursor", plan: "Pro" },
        { tool: "GitHub Copilot", plan: "Business" },
      ],
    };

    const diff = computeAuditDiff(auditOld, auditNew);
    expect(diff.spendDelta).toBe(-600);
    expect(diff.spendReduced).toBe(true);
    expect(diff.savingsDelta).toBe(400);
    expect(diff.scoreDelta).toBe(17);
    expect(diff.ghostSeatsDelta).toBe(-5);
    expect(diff.addedTools.some((t) => t.tool === "Cursor")).toBe(true);
    expect(diff.removedTools.some((t) => t.tool === "ChatGPT")).toBe(true);
    expect(diff.retainedTools.some((t) => t.tool === "GitHub Copilot")).toBe(true);
  });
});
