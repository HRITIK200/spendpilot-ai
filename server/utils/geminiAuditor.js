import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateFallbackAudit = (tools) => {
  let totalMonthlySavings = 0;

  const auditedTools = tools.map((tool) => {
    let recommendation = "Current plan looks optimized.";
    let savings = 0;
    let optimizedPlan = tool.plan;
    let reasoning = "Your current setup appears cost-efficient.";

    // Rule 1: Small teams using Team plans
    if (tool.plan === "Team" && Number(tool.seats) <= 2) {
      optimizedPlan = "Plus";
      savings = 10 * Number(tool.seats);
      recommendation = "Downgrade to Plus plan";
      reasoning = "Small teams of 2 or fewer seats typically do not require collaboration-focused Team plans.";
    }

    // Rule 2: Enterprise overkill
    if (tool.plan === "Enterprise" && Number(tool.seats) < 10) {
      optimizedPlan = "Business";
      savings = 20 * Number(tool.seats);
      recommendation = "Business plan may be more cost-efficient";
      reasoning = "Enterprise pricing tiers are usually better suited for larger organizations.";
    }

    // Rule 3: Coding workflow mismatch
    if (tool.useCase === "coding" && tool.tool === "ChatGPT") {
      recommendation = "Consider Cursor or GitHub Copilot";
      reasoning = "Development-focused IDE tools may provide better coding workflow efficiency.";
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

  const optimizationScore = Math.max(100 - totalMonthlySavings, 65);

  return {
    auditedTools,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    optimizationScore,
  };
};

export const auditWithGemini = async (tools) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. Falling back to rule-based heuristics.");
    return generateFallbackAudit(tools);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      You are a FinOps and AI infrastructure cost optimization expert.
      Analyze the following list of active AI tools configured in an organization:
      ${JSON.stringify(tools, null, 2)}

      For each tool, compute optimization recommendations:
      1. Settle plan tiers:
         - Downgrade 'Team' subscriptions to 'Plus'/'Pro' if seats <= 2 (saves ~$10/seat/mo).
         - Right-size 'Enterprise' subscriptions to 'Business' if seats < 10 (saves ~$20/seat/mo).
         - Flag developer tooling mismatch (e.g. suggest developers using ChatGPT migrate to Cursor/GitHub Copilot for context-aware code generation).
      2. If a plan is already optimized, keep it as is, setting monthlySavings to 0, optimizedPlan to the current plan, recommendation to "Current plan looks optimized.", and reasoning to "Your current setup appears cost-efficient."
      3. For each tool object, compute:
         - optimizedPlan: The recommended plan string.
         - monthlySavings: Monthly cost savings in USD.
         - annualSavings: monthlySavings * 12.
         - recommendation: Direct recommendation description.
         - reasoning: Explanatory rationale.

      Calculate the final metrics:
      - totalMonthlySavings: Sum of monthlySavings of all audited tools.
      - totalAnnualSavings: totalMonthlySavings * 12.
      - optimizationScore: Calculated as Math.max(100 - totalMonthlySavings, 65).

      Return a single JSON object strictly matching this schema:
      {
        "auditedTools": [
          {
            "tool": "string",
            "plan": "string",
            "seats": number,
            "useCase": "string",
            "monthlyCost": number,
            "optimizedPlan": "string",
            "monthlySavings": number,
            "annualSavings": number,
            "recommendation": "string",
            "reasoning": "string"
          }
        ],
        "totalMonthlySavings": number,
        "totalAnnualSavings": number,
        "optimizationScore": number
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    // Validate structure before returning, fallback if parsed format is corrupt
    if (parsed && Array.isArray(parsed.auditedTools) && typeof parsed.optimizationScore === "number") {
      return parsed;
    }

    throw new Error("Invalid output structure returned by Gemini API.");
  } catch (error) {
    console.error("Gemini API call failed or returned bad format. Falling back to heuristics. Error:", error);
    return generateFallbackAudit(tools);
  }
};
