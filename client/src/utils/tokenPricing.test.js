import { describe, it, expect } from "vitest";
import { LLM_MODELS, calculateModelMonthlyCost } from "./tokenPricing";

describe("tokenPricing utility", () => {
  it("exports catalog with frontier and budget models", () => {
    expect(LLM_MODELS.length).toBeGreaterThanOrEqual(8);
    const gpt4o = LLM_MODELS.find((m) => m.id === "gpt-4o");
    const claudeSonnet = LLM_MODELS.find((m) => m.id === "claude-3-5-sonnet");
    const deepseek = LLM_MODELS.find((m) => m.id === "deepseek-v3");

    expect(gpt4o).toBeDefined();
    expect(claudeSonnet).toBeDefined();
    expect(deepseek).toBeDefined();
  });

  it("calculates model monthly cost correctly with prompt caching savings", () => {
    const claudeSonnet = LLM_MODELS.find((m) => m.id === "claude-3-5-sonnet");
    const result = calculateModelMonthlyCost({
      model: claudeSonnet,
      monthlyInputTokens: 10_000_000,
      monthlyOutputTokens: 2_000_000,
      cacheHitRatio: 0.50, // 50% cached
    });

    expect(result.modelId).toBe("claude-3-5-sonnet");
    expect(result.inputCost).toBeGreaterThan(0);
    expect(result.outputCost).toBe(30.00); // 2M * $15/1M
    expect(result.cachingSavings).toBeGreaterThan(0);
    expect(result.totalCost).toBeLessThan(result.costWithoutCache);
    expect(result.annualCost).toBe(Math.round(result.totalCost * 12));
  });

  it("calculates lower cost for budget model vs flagship", () => {
    const gpt4o = LLM_MODELS.find((m) => m.id === "gpt-4o");
    const gpt4oMini = LLM_MODELS.find((m) => m.id === "gpt-4o-mini");

    const costFlagship = calculateModelMonthlyCost({
      model: gpt4o,
      monthlyInputTokens: 20_000_000,
      monthlyOutputTokens: 5_000_000,
      cacheHitRatio: 0.2,
    });

    const costBudget = calculateModelMonthlyCost({
      model: gpt4oMini,
      monthlyInputTokens: 20_000_000,
      monthlyOutputTokens: 5_000_000,
      cacheHitRatio: 0.2,
    });

    expect(costBudget.totalCost).toBeLessThan(costFlagship.totalCost);
  });
});
