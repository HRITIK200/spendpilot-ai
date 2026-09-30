import { Sparkles, Cpu, Layers, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const AI_TOOLS = [
  {
    name: "ChatGPT",
    vendor: "OpenAI",
    category: "AI Assistant",
    tiers: "Plus, Team, Enterprise",
    badgeColor: "bg-emerald-400/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  {
    name: "Claude",
    vendor: "Anthropic",
    category: "Reasoning & Writing",
    tiers: "Pro, Team, Enterprise",
    badgeColor: "bg-amber-400/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  {
    name: "Cursor",
    vendor: "Anysphere",
    category: "AI Code Editor",
    tiers: "Pro, Business, Enterprise",
    badgeColor: "bg-blue-400/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
  },
  {
    name: "GitHub Copilot",
    vendor: "Microsoft",
    category: "Code Completion",
    tiers: "Individual, Business, Enterprise",
    badgeColor: "bg-purple-400/10 text-purple-400 border-purple-500/20",
    dot: "bg-purple-400",
  },
  {
    name: "Google Gemini",
    vendor: "Google DeepMind",
    category: "Multimodal Assistant",
    tiers: "Pro, Ultra, API",
    badgeColor: "bg-cyan-400/10 text-cyan-400 border-cyan-500/20",
    dot: "bg-cyan-400",
  },
  {
    name: "Windsurf",
    vendor: "Codeium",
    category: "Agentic IDE Flow",
    tiers: "Pro, Teams",
    badgeColor: "bg-teal-400/10 text-teal-400 border-teal-500/20",
    dot: "bg-teal-400",
  },
  {
    name: "OpenAI API",
    vendor: "OpenAI Platform",
    category: "Token Infrastructure",
    tiers: "Starter, Growth, Scale",
    badgeColor: "bg-emerald-400/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  {
    name: "Anthropic API",
    vendor: "Claude API",
    category: "Model Gateway",
    tiers: "Tier 1 - 4 Enterprise",
    badgeColor: "bg-orange-400/10 text-orange-400 border-orange-500/20",
    dot: "bg-orange-400",
  },
];

function AIEcosystem() {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden border-t border-b border-white/5 bg-[#050811]/60">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
            <Cpu size={14} className="text-blue-400" />
            Supported AI Ecosystem
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Auditing & Optimizing Leading AI SaaS
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3 leading-relaxed">
            SpendPilot AI evaluates plan tiers, seat utilization, and redundant licensing across your company's entire artificial intelligence stack.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {AI_TOOLS.map((tool, idx) => (
            <div
              key={idx}
              className="bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-blue-500/40 p-4 sm:p-5 rounded-2xl transition duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-gray-500 font-medium">{tool.vendor}</span>
                  <span className={`w-2 h-2 rounded-full ${tool.dot} animate-pulse`} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition flex items-center justify-between">
                  <span>{tool.name}</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{tool.category}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] text-gray-500 font-mono truncate max-w-[150px]">
                  {tool.tiers}
                </span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${tool.badgeColor}`}>
                  Audited
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="mt-10 sm:mt-12 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Have a unique AI stack or custom API tier?</p>
              <p className="text-xs text-gray-400">SpendPilot's audit engine automatically detects multi-seat redundancy and tier mismatches.</p>
            </div>
          </div>
          <Link
            to="/audit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-md shrink-0"
          >
            Audit Your Stack Now &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AIEcosystem;
