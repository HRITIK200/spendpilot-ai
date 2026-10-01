import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Clock, Layers, CheckCircle2, ShieldAlert, Zap, ArrowRight } from "lucide-react";

function Hero() {
  const [teamSize, setTeamSize] = useState(15);

  // Heuristics:
  // - Average spend per user on AI tools: ~$80/month (e.g. ChatGPT Team + Claude Team + Cursor + Copilot)
  // - SpendPilot AI optimization typically cuts spend by ~25% (~$20/user/month)
  const estimatedBaseline = teamSize * 80;
  const monthlySavings = teamSize * 20;
  const annualSavings = monthlySavings * 12;
  const optimizedMonthly = estimatedBaseline - monthlySavings;

  const presetSeats = [5, 15, 30, 60, 120];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24 relative overflow-hidden">
      {/* Background ambient lighting and subtle tech mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(59,130,246,0.18),rgba(0,0,0,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-60" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Floating Micro-Cards (Desktop Visual Polish) */}
      <div className="hidden xl:block absolute top-[22%] left-[4%] animate-float-slow-1 bg-[#0b1222]/90 backdrop-blur-xl border border-white/10 border-l-4 border-l-emerald-500 px-4 py-3 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Plan Right-Sizing</p>
            <p className="text-xs font-bold text-white mt-0.5">ChatGPT Plus &rarr; Team Tier</p>
          </div>
          <span className="text-[11px] text-emerald-400 font-extrabold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg">+$360/yr</span>
        </div>
      </div>

      <div className="hidden xl:block absolute top-[36%] right-[4%] animate-float-slow-2 bg-[#0b1222]/90 backdrop-blur-xl border border-white/10 border-l-4 border-l-amber-500 px-4 py-3 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldAlert size={16} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Redundancy Overlap</p>
            <p className="text-xs font-bold text-white mt-0.5">Cursor & Copilot Consolidated</p>
          </div>
          <span className="text-[11px] text-amber-400 font-extrabold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">100% Score</span>
        </div>
      </div>

      <div className="hidden xl:block absolute bottom-[24%] left-[5%] animate-float-slow-3 bg-[#0b1222]/90 backdrop-blur-xl border border-white/10 border-l-4 border-l-cyan-500 px-4 py-3 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Zap size={16} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Unused Seat Pruning</p>
            <p className="text-xs font-bold text-white mt-0.5">14 Idle Windsurf Seats Cut</p>
          </div>
          <span className="text-[11px] text-cyan-400 font-extrabold bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-lg">-$4,200/yr</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
          <Sparkles size={14} className="text-blue-400" />
          <span className="text-xs sm:text-sm font-semibold text-blue-300">
            Automated Enterprise AI SaaS FinOps
          </span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-white">
          Stop Overspending
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            On AI Tooling
          </span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-xl mt-5 sm:mt-6 max-w-2xl mx-auto leading-relaxed">
          Audit your ChatGPT, Claude, Cursor, Copilot, and API commitments instantly.
          Right-size license tiers and eliminate duplicate seats in under 60 seconds.
        </p>

        {/* CTA Button */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 flex-wrap">
          <Link
            to="/audit"
            className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black px-6 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:scale-105 transition duration-200 shadow-xl shadow-white/10 inline-flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Run 60-Second Free Audit</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Interactive ROI Calculator Widget */}
        <div className="max-w-2xl mx-auto mt-12 sm:mt-16 p-4 sm:p-7 md:p-8 bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl relative group hover:border-white/20 transition-all duration-300">
          <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-[11px] font-bold px-4 py-1.5 rounded-full text-white uppercase tracking-wider shadow-lg flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <Zap size={13} />
            <span>Interactive ROI Calculator</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 mt-1">
            <h3 className="text-base sm:text-lg font-bold text-white text-left">
              Estimate Your Organization's Savings
            </h3>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full self-start sm:self-auto">
              ~25% Average Cost Reduction
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {/* Slider Row */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs sm:text-sm text-gray-400 font-medium">Team AI Users</span>
                <span className="text-base sm:text-lg font-bold text-white bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-xl font-mono">
                  {teamSize} seats
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="150"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-[11px] text-gray-400">
                <span className="text-gray-500 font-medium">Quick Presets:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {presetSeats.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTeamSize(num)}
                      className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono transition ${
                        teamSize === num
                          ? "bg-blue-600 border-blue-500 text-white font-bold"
                          : "border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
              <div className="text-left bg-white/[0.03] p-3.5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Estimated Current Spend
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-200 mt-1 font-mono">
                  ${estimatedBaseline.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/mo</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">Based on multi-tool stacks</p>
              </div>

              <div className="text-left bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20">
                <p className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
                  Monthly Savings
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
                  +${monthlySavings.toLocaleString()}<span className="text-xs text-emerald-400/80 font-normal">/mo</span>
                </p>
                <p className="text-[10px] text-emerald-400/70 mt-0.5">Immediate cash preserved</p>
              </div>

              <div className="text-left bg-blue-500/10 p-3.5 rounded-2xl border border-blue-500/20">
                <p className="text-[10px] text-blue-300 uppercase tracking-wider font-semibold">
                  Annual Runway Saved
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-blue-400 mt-1 font-mono">
                  +${annualSavings.toLocaleString()}<span className="text-xs text-blue-400/80 font-normal">/yr</span>
                </p>
                <p className="text-[10px] text-blue-400/70 mt-0.5">Reinvested into engineering</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 transition duration-300 text-left flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">${annualSavings.toLocaleString()}</h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Projected annual company savings</p>
            </div>
          </div>

          <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-amber-500/30 rounded-2xl p-6 transition duration-300 text-left flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">60 Seconds</h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Average time to full audit report</p>
            </div>
          </div>

          <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/30 rounded-2xl p-6 transition duration-300 text-left flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">8+ Major Tools</h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">OpenAI, Claude, Cursor, Copilot & APIs</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;