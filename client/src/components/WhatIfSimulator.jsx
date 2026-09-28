import React, { useState, useMemo } from "react";
import { Sliders, RotateCcw, TrendingUp, TrendingDown, Users, Sparkles, Check, Ban, DollarSign, Zap } from "lucide-react";

// Standard SaaS pricing approximations ($/seat/month)
const TOOL_PRICING_CATALOG = {
  "ChatGPT": {
    "Free": 0,
    "Plus": 20,
    "Team": 30,
    "Enterprise": 60,
  },
  "Claude": {
    "Free": 0,
    "Pro": 20,
    "Team": 30,
    "Enterprise": 60,
  },
  "Cursor": {
    "Hobby": 0,
    "Pro": 20,
    "Business": 40,
    "Enterprise": 60,
  },
  "GitHub Copilot": {
    "Individual": 10,
    "Business": 19,
    "Enterprise": 39,
  },
  "Gemini": {
    "Free": 0,
    "Advanced": 20,
    "Business": 24,
    "Enterprise": 30,
  },
  "Midjourney": {
    "Basic": 10,
    "Standard": 30,
    "Pro": 60,
    "Mega": 120,
  },
  "Perplexity": {
    "Free": 0,
    "Pro": 20,
    "Enterprise": 40,
  },
};

const getAvailablePlans = (toolName, currentPlan, optimizedPlan) => {
  const catalog = TOOL_PRICING_CATALOG[toolName];
  if (catalog) {
    return Object.keys(catalog);
  }
  const plans = new Set(["Free", "Standard", "Pro", "Team", "Enterprise"]);
  if (currentPlan) plans.add(currentPlan);
  if (optimizedPlan) plans.add(optimizedPlan);
  return Array.from(plans);
};

const getPlanRate = (toolName, planName, fallbackUnitCost) => {
  const catalog = TOOL_PRICING_CATALOG[toolName];
  if (catalog && catalog[planName] !== undefined) {
    return catalog[planName];
  }
  const lower = planName.toLowerCase();
  if (lower.includes("free") || lower.includes("hobby")) return 0;
  if (lower.includes("plus") || lower.includes("pro") || lower.includes("individual")) return 20;
  if (lower.includes("team") || lower.includes("business")) return 30;
  if (lower.includes("enterprise")) return 50;
  return fallbackUnitCost > 0 ? fallbackUnitCost : 20;
};

export default function WhatIfSimulator({ auditedTools = [], originalScore = 80, originalMonthlySavings = 0 }) {
  // Baseline initial state from auditedTools
  const initialSimState = useMemo(() => {
    return auditedTools.map((tool) => {
      const seats = Number(tool.seats) || 1;
      const monthlyCost = Number(tool.monthlyCost) || 0;
      const unitCost = seats > 0 ? monthlyCost / seats : monthlyCost;

      return {
        id: tool._id || tool.tool,
        name: tool.tool,
        originalPlan: tool.plan || "Team",
        originalSeats: seats,
        originalCost: monthlyCost,
        fallbackUnitCost: unitCost,
        // Simulation variables:
        enabled: true,
        simPlan: tool.optimizedPlan || tool.plan || "Team",
        simSeats: seats,
      };
    });
  }, [auditedTools]);

  const [simTools, setSimTools] = useState(initialSimState);

  // Sync state if auditedTools changes (e.g. initial fetch)
  React.useEffect(() => {
    setSimTools(initialSimState);
  }, [initialSimState]);

  const handleToggleTool = (id) => {
    setSimTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleSeatsChange = (id, newSeats) => {
    const val = Math.max(1, parseInt(newSeats, 10) || 1);
    setSimTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, simSeats: val } : t))
    );
  };

  const handlePlanChange = (id, newPlan) => {
    setSimTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, simPlan: newPlan } : t))
    );
  };

  const handleReset = () => {
    setSimTools(initialSimState);
  };

  // Live Calculations
  const calculations = useMemo(() => {
    let baselineTotal = 0;
    let simulatedTotal = 0;
    let modifiedCount = 0;

    simTools.forEach((t) => {
      baselineTotal += t.originalCost;

      if (!t.enabled) {
        modifiedCount++;
        return; // cost is 0
      }

      const rate = getPlanRate(t.name, t.simPlan, t.fallbackUnitCost);
      const toolSimCost = rate * t.simSeats;
      simulatedTotal += toolSimCost;

      if (t.simPlan !== t.originalPlan || t.simSeats !== t.originalSeats) {
        modifiedCount++;
      }
    });

    const monthlySavings = baselineTotal - simulatedTotal;
    const annualSavings = monthlySavings * 12;

    // Projected efficiency score calculation
    let projectedScore = originalScore;
    if (baselineTotal > 0) {
      const deltaSavings = monthlySavings - originalMonthlySavings;
      const deltaPercentage = (deltaSavings / baselineTotal) * 45;
      projectedScore = Math.min(100, Math.max(10, Math.round(originalScore + deltaPercentage)));
    }

    return {
      baselineTotal,
      simulatedTotal,
      monthlySavings,
      annualSavings,
      projectedScore,
      modifiedCount,
    };
  }, [simTools, originalScore, originalMonthlySavings]);

  if (!auditedTools || auditedTools.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-blue-950/20 border border-blue-500/20 rounded-3xl p-5 sm:p-8 mb-12 shadow-2xl relative overflow-hidden no-print">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles size={13} className="text-blue-400" />
              Interactive FinOps Tool
            </span>
            {calculations.modifiedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                {calculations.modifiedCount} parameter{calculations.modifiedCount > 1 ? "s" : ""} modified
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="text-blue-400" size={24} />
            "What-If" Scenario Simulator
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Test different team sizes, cancel unused tools, or switch plan tiers to see real-time impact on your monthly budget and efficiency score before committing.
          </p>
        </div>

        {calculations.modifiedCount > 0 && (
          <button
            onClick={handleReset}
            className="self-start md:self-center inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition"
          >
            <RotateCcw size={13} />
            Reset to Baseline
          </button>
        )}
      </div>

      {/* LIVE SIMULATOR METRICS BANNER */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6 relative z-10">
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Simulated Spend</p>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">
            ${Math.max(0, calculations.simulatedTotal)}/mo
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Baseline: ${calculations.baselineTotal}/mo
          </p>
        </div>

        <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <DollarSign size={12} />
            Projected Savings
          </p>
          <div className={`text-xl sm:text-2xl font-black mt-1 ${calculations.monthlySavings >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {calculations.monthlySavings >= 0 ? `+$${calculations.monthlySavings}` : `-$${Math.abs(calculations.monthlySavings)}`}/mo
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            ${calculations.annualSavings >= 0 ? `+$${calculations.annualSavings}` : `-$${Math.abs(calculations.annualSavings)}`}/yr
          </p>
        </div>

        <div className="bg-black/40 border border-purple-500/20 rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
            <Zap size={12} />
            Projected Score
          </p>
          <div className="text-xl sm:text-2xl font-black text-purple-300 mt-1 flex items-baseline gap-1">
            {calculations.projectedScore}
            <span className="text-xs text-gray-500 font-normal">/100</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Baseline: {originalScore}/100
          </p>
        </div>

        <div className="bg-black/40 border border-blue-500/20 rounded-2xl p-4 flex flex-col justify-between">
          <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Net Optimization</p>
          <div className="flex items-center gap-2 mt-1">
            {calculations.monthlySavings >= 0 ? (
              <TrendingUp className="text-emerald-400 shrink-0" size={20} />
            ) : (
              <TrendingDown className="text-rose-400 shrink-0" size={20} />
            )}
            <span className="text-xs font-bold text-gray-200">
              {calculations.baselineTotal > 0
                ? `${Math.round((calculations.monthlySavings / calculations.baselineTotal) * 100)}% budget reduction`
                : "No baseline spend"}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(0, calculations.projectedScore))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* TOOLS TUNING CONTROLS */}
      <div className="space-y-3.5 relative z-10 mt-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>Tune Individual Tooling Parameters</span>
        </h3>

        <div className="grid gap-3">
          {simTools.map((tool) => {
            const plans = getAvailablePlans(tool.name, tool.originalPlan, tool.simPlan);
            const rate = getPlanRate(tool.name, tool.simPlan, tool.fallbackUnitCost);
            const currentToolSimCost = tool.enabled ? rate * tool.simSeats : 0;
            const diff = tool.originalCost - currentToolSimCost;

            return (
              <div
                key={tool.id}
                className={`border rounded-2xl p-4 transition-all duration-200 ${
                  tool.enabled
                    ? "bg-white/[0.03] border-white/10 hover:border-white/20"
                    : "bg-rose-950/10 border-rose-500/20 opacity-70"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Tool Name & Keep/Cancel toggle */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <button
                      type="button"
                      onClick={() => handleToggleTool(tool.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition border ${
                        tool.enabled
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                      }`}
                      title={tool.enabled ? "Click to simulate cancelling this tool" : "Click to retain this tool"}
                    >
                      {tool.enabled ? <Check size={16} /> : <Ban size={16} />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${tool.enabled ? "text-white" : "text-gray-400 line-through"}`}>
                          {tool.name}
                        </span>
                        {!tool.enabled && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-bold uppercase">
                            Cancelled
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500">
                        Baseline: {tool.originalPlan} ({tool.originalSeats} seat{tool.originalSeats > 1 ? "s" : ""}) · ${tool.originalCost}/mo
                      </span>
                    </div>
                  </div>

                  {/* Middle: Plan Tier and Seats Slider (if enabled) */}
                  {tool.enabled ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      {/* Plan Tier Selector */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Subscription Plan
                        </label>
                        <select
                          value={tool.simPlan}
                          onChange={(e) => handlePlanChange(tool.id, e.target.value)}
                          className="bg-black/50 border border-white/10 hover:border-blue-500/40 text-gray-200 text-xs rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 transition"
                        >
                          {plans.map((p) => {
                            const pRate = getPlanRate(tool.name, p, tool.fallbackUnitCost);
                            return (
                              <option key={p} value={p} className="bg-gray-900 text-white">
                                {p} (${pRate}/seat/mo)
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Seats Slider */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Users size={11} />
                            Allocated Seats
                          </span>
                          <span className="text-blue-400 font-bold text-xs">{tool.simSeats} seat{tool.simSeats > 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="1"
                            max={Math.max(50, tool.originalSeats * 2)}
                            value={tool.simSeats}
                            onChange={(e) => handleSeatsChange(tool.id, e.target.value)}
                            className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center text-xs text-rose-300/80 italic">
                      Tool subscription marked for full cancellation in this scenario. 100% cost reduction modeled.
                    </div>
                  )}

                  {/* Right: Cost delta for this tool */}
                  <div className="text-left lg:text-right shrink-0 min-w-[130px] border-t lg:border-t-0 pt-2 lg:pt-0 border-white/5">
                    <div className="text-xs font-semibold text-gray-300">
                      ${currentToolSimCost}/mo
                    </div>
                    <div className={`text-xs font-bold mt-0.5 ${diff >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {diff >= 0 ? `Save $${diff}/mo` : `+$${Math.abs(diff)}/mo spend`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
