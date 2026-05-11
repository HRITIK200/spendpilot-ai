import { describe, it, expect } from "vitest";

import { generateAudit } from "./auditEngine";

describe("Audit Engine", () => {

  it("should downgrade Team plan for small teams", () => {

    const tools = [
      {
        tool: "Claude",
        plan: "Team",
        seats: 2,
        useCase: "writing",
      },
    ];

    const result = generateAudit(tools);

    expect(
      result.auditedTools[0].optimizedPlan
    ).toBe("Plus");
  });

  it("should recommend Business instead of Enterprise", () => {

    const tools = [
      {
        tool: "ChatGPT",
        plan: "Enterprise",
        seats: 5,
        useCase: "research",
      },
    ];

    const result = generateAudit(tools);

    expect(
      result.auditedTools[0].optimizedPlan
    ).toBe("Business");
  });

  it("should calculate monthly savings correctly", () => {

    const tools = [
      {
        tool: "Claude",
        plan: "Team",
        seats: 2,
        useCase: "writing",
      },
    ];

    const result = generateAudit(tools);

    expect(
      result.totalMonthlySavings
    ).toBe(20);
  });

  it("should recommend coding tools for ChatGPT coding workflows", () => {

    const tools = [
      {
        tool: "ChatGPT",
        plan: "Plus",
        seats: 1,
        useCase: "coding",
      },
    ];

    const result = generateAudit(tools);

    expect(
      result.auditedTools[0].recommendation
    ).toContain("Cursor");
  });

  it("should generate annual savings correctly", () => {

    const tools = [
      {
        tool: "Claude",
        plan: "Team",
        seats: 2,
        useCase: "writing",
      },
    ];

    const result = generateAudit(tools);

    expect(
      result.totalAnnualSavings
    ).toBe(240);
  });

});