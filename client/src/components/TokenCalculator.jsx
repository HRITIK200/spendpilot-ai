import { useState, useMemo } from "react";
import { 
  Calculator, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck, 
  Sliders, 
  Layers, 
  RotateCcw,
  Info
} from "lucide-react";
import { LLM_MODELS, calculateModelMonthlyCost } from "../utils/tokenPricing";

export default function TokenCalculator({ onClose = null, isModal = false }) {
  const [inputTokensM, setInputTokensM] = useState(20); // 20 Million
  const [outputTokensM, setOutputTokensM] = useState(4); // 4 Million
  const [cacheRatioPct, setCacheRatioPct] = useState(35); // 35% cached
  const [baselineModelId, setBaselineModelId] = useState("legacy-gpt-4");
  const [targetModelId, setTargetModelId] = useState("gpt-4o-mini");

  const inputTokensTotal = inputTokensM * 1_000_000;
  const outputTokensTotal = outputTokensM * 1_000_000;
  const cacheHitRatio = cacheRatioPct / 100;

  // Compute cost for all models
  const modelComparisons = useMemo(() => {
    return LLM_MODELS.map((model) => {
      const calculation = calculateModelMonthlyCost({
        model,
        monthlyInputTokens: inputTokensTotal,
        monthlyOutputTokens: outputTokensTotal,
        cacheHitRatio,
      });
      return {
        ...model,
        ...calculation,
      };
    }).sort((a, b) => a.totalCost - b.totalCost);
  }, [inputTokensTotal, outputTokensTotal, cacheHitRatio]);

  const baselineCost = useMemo(() => {
    const found = modelComparisons.find((m) => m.id === baselineModelId);
    return found ? found.totalCost : 0;
  }, [modelComparisons, baselineModelId]);

  const targetCost = useMemo(() => {
    const found = modelComparisons.find((m) => m.id === targetModelId);
    return found ? found.totalCost : 0;
  }, [modelComparisons, targetModelId]);

  const monthlySavings = Math.max(0, baselineCost - targetCost);
  const percentSavings = baselineCost > 0 ? Math.round((monthlySavings / baselineCost) * 100) : 0;
  const annualSavings = monthlySavings * 12;

  const handleApplyPreset = (inM, outM, cachePct) => {
    setInputTokensM(inM);
    setOutputTokensM(outM);
    setCacheRatioPct(cachePct);
  };

  return (
    <div className={`w-full ${isModal ? "p-0" : "bg-black/40 border border-white/10 rounded-3xl p-5 sm:p-8 backdrop-blur-xl"}`}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calculator size={13} />
            Token & LLM Migration FinOps Engine
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Multi-Model Token Cost Calculator
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Simulate monthly LLM API bills, prompt caching efficiency, and migration savings across top frontier models.
          </p>
        </div>

        {/* WORKLOAD PRESETS */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Presets:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset(5, 1, 20)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition"
          >
            MVP (5M)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset(50, 10, 45)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition"
          >
            Scale SaaS (50M)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset(150, 25, 60)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition"
          >
            Enterprise RAG (150M)
          </button>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-6 border-b border-white/10">
        {/* SLIDER 1: INPUT TOKENS */}
        <div className="space-y-2 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">Monthly Input Tokens</span>
            <span className="font-bold text-blue-400 font-mono text-sm">{inputTokensM} Million</span>
          </div>
          <input
            type="range"
            min="1"
            max="200"
            step="1"
            value={inputTokensM}
            onChange={(e) => setInputTokensM(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>1M</span>
            <span>100M</span>
            <span>200M</span>
          </div>
        </div>

        {/* SLIDER 2: OUTPUT TOKENS */}
        <div className="space-y-2 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">Monthly Output Tokens</span>
            <span className="font-bold text-indigo-400 font-mono text-sm">{outputTokensM} Million</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="50"
            step="0.5"
            value={outputTokensM}
            onChange={(e) => setOutputTokensM(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>500k</span>
            <span>25M</span>
            <span>50M</span>
          </div>
        </div>

        {/* SLIDER 3: PROMPT CACHING HIT RATE */}
        <div className="space-y-2 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1">
              Prompt Cache Hit Ratio
              <span title="Claude & OpenAI prompt caching saves up to 90% on repeated system prompts">
                <Info size={12} className="text-gray-500" />
              </span>
            </span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{cacheRatioPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={cacheRatioPct}
            onChange={(e) => setCacheRatioPct(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>0% (No Cache)</span>
            <span>45%</span>
            <span>90% (Cached Loops)</span>
          </div>
        </div>
      </div>

      {/* MIGRATION ARBITRAGE CARD */}
      <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-blue-950/30 to-purple-950/40 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <TrendingDown size={15} />
            Model Migration Arbitrage & ROI
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-400">Migrating from:</span>
            <select
              value={baselineModelId}
              onChange={(e) => setBaselineModelId(e.target.value)}
              className="bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
            >
              {LLM_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-gray-900 text-white">
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>

            <ArrowRight size={14} className="text-gray-400" />

            <span className="text-gray-400">To:</span>
            <select
              value={targetModelId}
              onChange={(e) => setTargetModelId(e.target.value)}
              className="bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
            >
              {LLM_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-gray-900 text-white">
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Monthly Savings</p>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              +${monthlySavings.toLocaleString()}
              <span className="text-xs font-bold text-emerald-300 ml-1">/mo ({percentSavings}%)</span>
            </div>
            <p className="text-[10px] text-emerald-400/80 font-medium">
              ${annualSavings.toLocaleString()}/year annualized reduction
            </p>
          </div>
        </div>
      </div>

      {/* BENCHMARK COMPARISON TABLE */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers size={13} className="text-blue-400" />
          All Models Cost Leaderboard ({inputTokensM}M input / {outputTokensM}M output)
        </h4>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-gray-400 uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Model & Provider</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3">Rate (In / Out per 1M)</th>
                <th className="py-3 px-3">Caching Savings</th>
                <th className="py-3 px-4 text-right">Est. Monthly Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {modelComparisons.map((model) => {
                const isSelected = model.id === targetModelId;
                const isBaseline = model.id === baselineModelId;

                return (
                  <tr 
                    key={model.id}
                    className={`transition ${
                      isSelected 
                        ? "bg-emerald-500/10 hover:bg-emerald-500/15" 
                        : isBaseline 
                        ? "bg-amber-500/10 hover:bg-amber-500/15" 
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <td className="py-3 px-4 font-sans font-bold text-white flex items-center gap-2">
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                      {isBaseline && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                      <span>{model.name}</span>
                      <span className="text-[10px] text-gray-400 font-normal">({model.provider})</span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                        {model.tier}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400 text-[11px]">
                      ${model.inputPer1M} / ${model.outputPer1M}
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-semibold text-[11px]">
                      {model.cachingSavings > 0 ? `-$${model.cachingSavings.toLocaleString()}` : "$0"}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-white text-sm">
                      ${model.totalCost.toLocaleString()}
                      <span className="text-[10px] text-gray-500 font-normal ml-0.5">/mo</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
