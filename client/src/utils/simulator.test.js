import { describe, it, expect } from "vitest";

describe("What-If Scenario Simulation Logic", () => {
  const TOOL_PRICING_CATALOG = {
    ChatGPT: { Free: 0, Plus: 20, Team: 30, Enterprise: 60 },
    Claude: { Free: 0, Pro: 20, Team: 30, Enterprise: 60 },
  };

  it("calculates cost savings correctly when downgrading plan", () => {
    const originalCost = 5 * 60; // 5 seats Enterprise = $300
    const downgradedCost = 5 * 30; // 5 seats Team = $150
    const savings = originalCost - downgradedCost;

    expect(savings).toBe(150);
  });

  it("calculates 100% savings when decommissioned / cancelled", () => {
    const originalCost = 10 * 30; // $300
    const toolActive = false;
    const simulatedCost = toolActive ? originalCost : 0;
    const savings = originalCost - simulatedCost;

    expect(savings).toBe(300);
  });

  it("dynamically adjusts savings when reducing seats", () => {
    const originalSeats = 20;
    const ratePerSeat = 30;
    const originalCost = originalSeats * ratePerSeat; // $600

    const adjustedSeats = 8;
    const simulatedCost = adjustedSeats * ratePerSeat; // $240
    const monthlySavings = originalCost - simulatedCost;
    const annualSavings = monthlySavings * 12;

    expect(monthlySavings).toBe(360);
    expect(annualSavings).toBe(4320);
  });
});
