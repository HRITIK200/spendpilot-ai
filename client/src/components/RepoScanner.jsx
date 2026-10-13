import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GitBranch, 
  Search, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  DollarSign, 
  Users, 
  Cpu, 
  Layers, 
  RotateCcw,
  Zap,
  TrendingDown
} from "lucide-react";
import { scanGitHubRepository, DEMO_REPOSITORIES } from "../utils/repoScanner";

export default function RepoScanner({ onExportToAudit, isModal = false }) {
  const navigate = useNavigate();
  const [repoInput, setRepoInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const scanSteps = [
    "Connecting to GitHub repository...",
    "Inspecting dependency manifests (package.json, requirements.txt)...",
    "Analyzing AI model invocations & IDE configs (.cursorrules)...",
    "Modeling team size & FinOps cost optimization...",
  ];

  const handleScan = async (targetUrl) => {
    const url = targetUrl || repoInput;
    if (!url || !url.trim()) {
      setError("Please enter a GitHub repository URL or select a demo below.");
      return;
    }

    setError(null);
    setScanning(true);
    setScanResult(null);
    setScanStep(0);

    // Simulate progressive scanner feedback
    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await scanGitHubRepository(url);
      clearInterval(stepInterval);
      setScanStep(scanSteps.length - 1);
      setTimeout(() => {
        setScanResult(result);
        setScanning(false);
      }, 300);
    } catch (err) {
      clearInterval(stepInterval);
      setScanning(false);
      setError(err.message || "Failed to scan repository. Please check that the repository is public and accessible.");
    }
  };

  const handlePresetClick = (presetUrl) => {
    setRepoInput(presetUrl);
    handleScan(presetUrl);
  };

  const handleProceedToAudit = () => {
    if (!scanResult?.prefilledTools) return;
    if (onExportToAudit) {
      onExportToAudit(scanResult.prefilledTools);
    } else {
      navigate("/audit", {
        state: { 
          prefilledTools: scanResult.prefilledTools,
          repoName: `${scanResult.repository.owner}/${scanResult.repository.repo}`
        }
      });
    }
  };

  return (
    <section 
      id={!isModal ? "repo-scanner" : undefined} 
      className={isModal 
        ? "p-0 relative w-full" 
        : "py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#040814] border-t border-b border-white/5 no-print"
      }
    >
      {/* Background glow accents */}
      {!isModal && (
        <>
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
        </>
      )}

      <div className={isModal ? "w-full relative z-10" : "max-w-6xl mx-auto relative z-10"}>
        
        {/* SECTION HEADER */}
        {!isModal && (
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-300 uppercase tracking-wider mb-4">
              <Sparkles size={14} className="text-blue-400" />
              Instant Developer FinOps Intelligence
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Audit Any GitHub Repository
            </h2>
            <p className="text-gray-400 mt-3 text-sm sm:text-base md:text-lg leading-relaxed">
              Paste any public GitHub repository URL. SpendPilot AI parses dependencies, detects AI models & dev tooling, and projects instant cost optimization.
            </p>
          </div>
        )}

        {/* REPO URL INPUT BAR */}
        <div className="max-w-3xl mx-auto bg-black/50 border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-xl">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleScan();
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <GitBranch size={18} />
              </div>
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="github.com/owner/repo (e.g. vercel/ai-chatbot)"
                className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                disabled={scanning}
              />
            </div>

            <button
              type="submit"
              disabled={scanning}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition duration-200 active:scale-95 disabled:opacity-50 shrink-0"
            >
              {scanning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Scan Repo</span>
                </>
              )}
            </button>
          </form>

          {/* DEMO PRESETS */}
          <div className="flex flex-wrap items-center gap-2 pt-3.5 mt-2 border-t border-white/5 text-xs text-gray-400">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mr-1">
              Quick Try:
            </span>
            {DEMO_REPOSITORIES.map((demo) => (
              <button
                key={demo.name}
                type="button"
                onClick={() => handlePresetClick(demo.url)}
                disabled={scanning}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/30 text-gray-300 hover:text-white transition text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>{demo.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="max-w-3xl mx-auto mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-center gap-3">
            <AlertTriangle size={18} className="shrink-0 text-rose-400" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
              <p className="text-[11px] text-rose-400/80 mt-0.5">Try one of the quick presets above to test the scanner immediately.</p>
            </div>
          </div>
        )}

        {/* SCANNING PROGRESS ANIMATION */}
        {scanning && (
          <div className="max-w-3xl mx-auto mt-8 p-6 rounded-3xl bg-black/40 border border-blue-500/20 backdrop-blur-md text-center animate-fadeIn">
            <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-3 animate-pulse">
              <Cpu size={24} />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-2">
              Analyzing Repository Architecture
            </h4>
            <p className="text-blue-400 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              {scanSteps[scanStep]}
            </p>

            <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-1.5 mt-5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* SCAN RESULTS DISPLAY */}
        {scanResult && (
          <div className="mt-10 bg-black/40 border border-white/10 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl animate-fadeIn space-y-6">
            
            {/* RESULTS HEADER */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Scan Complete
                  </span>
                  {scanResult.repository?.language && (
                    <span className="text-xs text-gray-400 font-mono px-2 py-0.5 rounded bg-white/5">
                      {scanResult.repository.language}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="break-all sm:break-normal">{scanResult.repository.owner}/{scanResult.repository.repo}</span>
                  {scanResult.repository.html_url && (
                    <a 
                      href={scanResult.repository.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-white transition shrink-0"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </h3>
                {scanResult.repository?.description && (
                  <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl line-clamp-2">
                    {scanResult.repository.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-stretch sm:self-auto w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setScanResult(null);
                    setRepoInput("");
                  }}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-medium transition"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedToAudit}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition active:scale-95"
                >
                  <span>Auto-Fill Audit Form</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* METRICS SUMMARY BANNER */}
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estimated Monthly Spend</p>
                <div className="text-2xl font-black text-white mt-1">
                  ${scanResult.totalMonthlySpend}/mo
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Based on {scanResult.estimatedSeats} active dev seats
                </p>
              </div>

              <div className="bg-white/[0.03] border border-emerald-500/20 rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingDown size={13} />
                  Projected Savings
                </p>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  +${scanResult.estimatedSavings}/mo
                </div>
                <p className="text-[10px] text-emerald-400/80 mt-0.5">
                  ${scanResult.annualSavings}/year optimized
                </p>
              </div>

              <div className="bg-white/[0.03] border border-purple-500/20 rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  <Users size={13} />
                  Modeled Team Size
                </p>
                <div className="text-2xl font-black text-purple-300 mt-1">
                  {scanResult.estimatedSeats} seats
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Contributor headcount heuristic
                </p>
              </div>

              <div className="bg-white/[0.03] border border-blue-500/20 rounded-2xl p-4">
                <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <Cpu size={13} />
                  Detected AI Tools
                </p>
                <div className="text-2xl font-black text-blue-300 mt-1">
                  {scanResult.detectedTools.length} stack items
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Auto-mapped to FinOps tiers
                </p>
              </div>
            </div>

            {/* DETECTED AI STACK CARDS */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} className="text-blue-400" />
                Detected AI & Engineering Tooling
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {scanResult.detectedTools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          {tool.tool}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 font-mono">
                        {tool.evidence}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        Mapped Plan: <strong className="text-gray-200">{tool.defaultPlan}</strong>
                      </span>
                      <span className="text-emerald-400 font-bold">
                        ${tool.planCost}/seat/mo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MODEL UPGRADE & MIGRATION ADVISORIES */}
            {scanResult.modelWarnings && scanResult.modelWarnings.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-400" />
                  Model Migration & Right-Sizing Advisories
                </h4>
                {scanResult.modelWarnings.map((w, idx) => (
                  <div key={idx} className="text-xs text-amber-200/90 leading-relaxed pl-2 border-l-2 border-amber-500/40">
                    <strong className="text-amber-300">{w.model}:</strong> {w.warning}
                  </div>
                ))}
              </div>
            )}

            {/* CTA BANNER TO PROCEED TO AUDIT */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  Ready to simulate scenarios and generate your certified audit?
                </h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  Transfer these {scanResult.detectedTools.length} detected tools with {scanResult.estimatedSeats} seats into the interactive simulator.
                </p>
              </div>

              <button
                type="button"
                onClick={handleProceedToAudit}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition active:scale-95 shrink-0"
              >
                <span>Transfer to Audit Simulator</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
