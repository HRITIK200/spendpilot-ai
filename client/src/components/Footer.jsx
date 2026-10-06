import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowUp, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ExternalLink,
  Cpu,
  Layers,
  FileText,
  X
} from "lucide-react";

export default function Footer() {
  const [modalContent, setModalContent] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPrivacyModal = (e) => {
    e.preventDefault();
    setModalContent({
      title: "Privacy & Zero-Data Architecture",
      icon: <Lock className="text-emerald-400" size={20} />,
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">Zero SaaS Token Ingestion:</strong> SpendPilot AI does not connect to your vendor APIs, OAuth tokens, or production environments. All audit evaluations are calculated based solely on anonymous seat allocations and subscription tiers you provide.
          </p>
          <p>
            <strong className="text-white">Client-Side Calculation:</strong> Calculations and scenario simulations execute in your browser. No telemetry or proprietary team metrics are shared with third-party advertisers.
          </p>
          <p>
            <strong className="text-white">Anonymous Public Reports:</strong> When you generate or share a public audit link, only aggregate subscription numbers and optimization scores are stored with cryptographic nonces.
          </p>
        </div>
      )
    });
  };

  const openTermsModal = (e) => {
    e.preventDefault();
    setModalContent({
      title: "Terms of Service & Advisory Disclaimer",
      icon: <FileText className="text-blue-400" size={20} />,
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">Cost Estimation Model:</strong> SpendPilot AI provides automated software cost optimization models based on public vendor pricing tiers (OpenAI, Anthropic, GitHub, Cursor, Google). Actual enterprise custom contracts and volume discounts may differ.
          </p>
          <p>
            <strong className="text-white">Independent SaaS Auditor:</strong> SpendPilot AI is an independent FinOps intelligence platform and is not affiliated, endorsed, or sponsored by OpenAI, Anthropic, Microsoft, or Google.
          </p>
          <p>
            <strong className="text-white">No Financial Guarantee:</strong> Recommendations represent potential savings under standard usage guidelines. Organizations should review their licensing commitments prior to canceling vendor agreements.
          </p>
        </div>
      )
    });
  };

  return (
    <footer className="relative bg-[#02050e] text-gray-400 border-t border-white/10 no-print overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-b from-blue-500/[0.04] to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-indigo-600/5 blur-[160px] pointer-events-none rounded-full" />

      {/* PRE-FOOTER CALL TO ACTION BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 relative z-10">
        <div className="relative rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-blue-950/40 via-gray-950/80 to-purple-950/30 backdrop-blur-xl shadow-2xl">
          {/* Subtle banner glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 border border-blue-500/20 bg-blue-500/10 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
                <Sparkles size={13} className="text-blue-400" />
                Instant ROI Discovery
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Ready to optimize your team's AI budget?
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base mt-2 leading-relaxed">
                Run an instant audit in under 60 seconds. Detect ghost licenses, eliminate duplicate tools, and right-size enterprise seats.
              </p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-[11px] sm:text-xs text-gray-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 size={14} /> Zero SaaS credentials required
                </span>
                <span className="flex items-center gap-1.5 text-blue-300 font-medium">
                  <CheckCircle2 size={14} /> 100% Free instant report
                </span>
                <span className="flex items-center gap-1.5 text-purple-300 font-medium">
                  <CheckCircle2 size={14} /> Shareable with CFO & leadership
                </span>
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <Link
                to="/audit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition duration-300 active:scale-95 group"
              >
                <span>Start Free AI Audit</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER DIRECTORY GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 border-t border-white/5 relative z-10">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* BRAND COLUMN (Spans 4 columns on lg) */}
          <div className="min-[480px]:col-span-2 lg:col-span-4 space-y-4">
            <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 inline-block">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">SpendPilot</span>
              <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">AI</span>
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Enterprise AI SaaS Cost Optimization & FinOps Intelligence. Audit tool sprawl, decommission ghost seats, and simulate future subscription growth.
            </p>

            {/* LIVE SYSTEM STATUS PILL */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-gray-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All FinOps Calculators Operational</span>
            </div>

            {/* SECURITY ARCHITECTURE BADGE */}
            <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-1">
              <ShieldCheck size={14} className="text-blue-400 shrink-0" />
              <span>Zero-Credential Architecture · Client-Side Evaluated</span>
            </div>
          </div>

          {/* COLUMN: PLATFORM */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-blue-400" />
              Platform
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/audit" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-400" />
                  Live Spend Audit
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-400" />
                  What-If Scenario Simulator
                </a>
              </li>
              <li>
                <a href="#ecosystem" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-400" />
                  AI Tool Ecosystem
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-400" />
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN: SUPPORTED TOOLS */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={13} className="text-purple-400" />
              Supported Tooling
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center justify-between pr-4">
                <span>ChatGPT (Plus / Team / Enterprise)</span>
                <span className="text-[10px] text-emerald-400 font-mono">OpenAI</span>
              </li>
              <li className="flex items-center justify-between pr-4">
                <span>Claude (Pro / Team / Enterprise)</span>
                <span className="text-[10px] text-amber-400 font-mono">Anthropic</span>
              </li>
              <li className="flex items-center justify-between pr-4">
                <span>Cursor & Windsurf</span>
                <span className="text-[10px] text-blue-400 font-mono">AI IDEs</span>
              </li>
              <li className="flex items-center justify-between pr-4">
                <span>GitHub Copilot & Gemini</span>
                <span className="text-[10px] text-purple-400 font-mono">Dev Suite</span>
              </li>
              <li className="flex items-center justify-between pr-4">
                <span>OpenAI & Claude API</span>
                <span className="text-[10px] text-orange-400 font-mono">Gateway</span>
              </li>
            </ul>
          </div>

          {/* COLUMN: TRUST & LEGAL */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button 
                  onClick={openPrivacyModal}
                  className="hover:text-emerald-400 transition text-left focus:outline-none"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={openTermsModal}
                  className="hover:text-emerald-400 transition text-left focus:outline-none"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <a 
                  href="https://github.com/HRITIK200/spendpilot-ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition inline-flex items-center gap-1 text-gray-400"
                >
                  <span>Source Code</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <Link to="/audit" className="hover:text-white transition text-gray-400">
                  Audit History Cloud
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/5 bg-black/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="text-center sm:text-left text-xs text-gray-500">
            <p>© {new Date().getFullYear()} SpendPilot AI. Built for modern engineering and finance teams.</p>
            <p className="text-[10px] text-gray-600 mt-1">
              Independent SaaS optimization tool. Tool trademarks are property of their respective providers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* GITHUB LINK */}
            <a
              href="https://github.com/HRITIK200/spendpilot-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition"
              title="View on GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* BACK TO TOP BUTTON */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs font-medium transition"
              title="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={13} />
            </button>
          </div>

        </div>
      </div>

      {/* INFORMATIONAL MODAL (PRIVACY / TERMS) */}
      {modalContent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setModalContent(null)}
        >
          <div 
            className="bg-[#0b0f19] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                {modalContent.icon}
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {modalContent.title}
                </h3>
              </div>
              <button
                onClick={() => setModalContent(null)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white border border-white/10 transition"
              >
                <X size={16} />
              </button>
            </div>

            {modalContent.content}

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
