/**
 * SpendPilot AI - Multi-Model LLM Token Pricing Engine
 * Current benchmark rates per 1,000,000 tokens (USD)
 */

export const LLM_MODELS = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    inputPer1M: 2.50,
    outputPer1M: 10.00,
    cachedInputPer1M: 1.25,
    contextWindow: "128k",
    recommendedFor: "General reasoning, coding, multimodal",
    tier: "Flagship",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o-mini",
    provider: "OpenAI",
    inputPer1M: 0.15,
    outputPer1M: 0.60,
    cachedInputPer1M: 0.075,
    contextWindow: "128k",
    recommendedFor: "High-volume classification, extraction, chat",
    tier: "Fast / Budget",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    inputPer1M: 3.00,
    outputPer1M: 15.00,
    cachedInputPer1M: 0.30, // 90% prompt caching discount
    contextWindow: "200k",
    recommendedFor: "Complex software engineering & agentic loops",
    tier: "Flagship",
  },
  {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    inputPer1M: 0.80,
    outputPer1M: 4.00,
    cachedInputPer1M: 0.08,
    contextWindow: "200k",
    recommendedFor: "Fast latency, code review, summarization",
    tier: "Fast / Budget",
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google Cloud",
    inputPer1M: 1.25,
    outputPer1M: 5.00,
    cachedInputPer1M: 0.3125,
    contextWindow: "2M",
    recommendedFor: "Huge multi-document analysis, repo-level RAG",
    tier: "Flagship",
  },
  {
    id: "gemini-1-5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google Cloud",
    inputPer1M: 0.075,
    outputPer1M: 0.30,
    cachedInputPer1M: 0.01875,
    contextWindow: "1M",
    recommendedFor: "Real-time streaming, high throughput pipelines",
    tier: "Fast / Budget",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek-V3",
    provider: "DeepSeek",
    inputPer1M: 0.14,
    outputPer1M: 0.28,
    cachedInputPer1M: 0.014,
    contextWindow: "64k",
    recommendedFor: "Ultra low-cost inference, math, general tasks",
    tier: "Open Weights / Cloud",
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    provider: "Groq / Meta",
    inputPer1M: 0.59,
    outputPer1M: 0.79,
    cachedInputPer1M: 0.59,
    contextWindow: "128k",
    recommendedFor: "Open source self-hosting or LPU acceleration",
    tier: "Open Weights / Cloud",
  },
  {
    id: "legacy-gpt-4",
    name: "GPT-4 (Legacy Baseline)",
    provider: "OpenAI",
    inputPer1M: 30.00,
    outputPer1M: 60.00,
    cachedInputPer1M: 30.00,
    contextWindow: "8k",
    recommendedFor: "Deprecated (Migrate immediately)",
    tier: "Legacy Baseline",
  },
  {
    id: "legacy-claude-opus",
    name: "Claude 3 Opus (Baseline)",
    provider: "Anthropic",
    inputPer1M: 15.00,
    outputPer1M: 75.00,
    cachedInputPer1M: 15.00,
    contextWindow: "200k",
    recommendedFor: "Legacy tier (Superseded by 3.5 Sonnet)",
    tier: "Legacy Baseline",
  },
];

/**
 * Calculates monthly cost for a given model with token volumes and caching
 */
export function calculateModelMonthlyCost({
  model,
  monthlyInputTokens = 10_000_000,
  monthlyOutputTokens = 2_000_000,
  cacheHitRatio = 0.40, // 40% cached
}) {
  const cachedInputs = monthlyInputTokens * cacheHitRatio;
  const standardInputs = monthlyInputTokens * (1 - cacheHitRatio);

  const inputCost = (standardInputs / 1_000_000) * model.inputPer1M;
  const cachedCost = (cachedInputs / 1_000_000) * (model.cachedInputPer1M || model.inputPer1M);
  const outputCost = (monthlyOutputTokens / 1_000_000) * model.outputPer1M;

  const totalCost = inputCost + cachedCost + outputCost;
  const costWithoutCache = ((monthlyInputTokens / 1_000_000) * model.inputPer1M) + outputCost;
  const cachingSavings = Math.max(0, costWithoutCache - totalCost);

  return {
    modelId: model.id,
    modelName: model.name,
    provider: model.provider,
    inputCost: Math.round(inputCost * 100) / 100,
    cachedCost: Math.round(cachedCost * 100) / 100,
    outputCost: Math.round(outputCost * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    costWithoutCache: Math.round(costWithoutCache * 100) / 100,
    cachingSavings: Math.round(cachingSavings * 100) / 100,
    annualCost: Math.round(totalCost * 12),
  };
}
