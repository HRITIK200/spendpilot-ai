import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  History, 
  X, 
  Trash2, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  GitCompare, 
  Calendar,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { getAuditHistory, clearAuditHistory, computeAuditDiff } from "../utils/auditHistory";

export default function AuditHistoryModal({ isOpen, onClose, onLoadAudit }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [selectedOldId, setSelectedOldId] = useState("");
  const [selectedNewId, setSelectedNewId] = useState("");
  const [activeTab, setActiveTab] = useState("list"); // 'list' or 'diff'

  useEffect(() => {
    if (isOpen) {
      const records = getAuditHistory();
      setHistory(records);
      if (records.length >= 2) {
        setSelectedOldId(records[1].id);
        setSelectedNewId(records[0].id);
      } else if (records.length === 1) {
        setSelectedNewId(records[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your local audit history?")) {
      clearAuditHistory();
      setHistory([]);
    }
  };

  const handleSelectAudit = (record) => {
    if (onLoadAudit) {
      onLoadAudit(record);
      onClose();
    } else {
      navigate("/audit", {
        state: {
          prefilledTools: record.tools,
          repoName: record.repoName,
          companyName: record.companyName,
        },
      });
      onClose();
    }
  };

  const auditOld = history.find((h) => h.id === selectedOldId);
  const auditNew = history.find((h) => h.id === selectedNewId);
  const diffResult = auditOld && auditNew ? computeAuditDiff(auditOld, auditNew) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-[#090e1d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <History size={20} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Audit Snapshot History & Diff</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-normal">
                  {history.length} saved
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Review previous audit snapshots and compare side-by-side optimization progress.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                title="Clear local audit history"
                className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* TAB TOGGLE: LIST VS DIFF */}
        <div className="flex border-b border-white/10 px-6 bg-black/20 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === "list" 
                ? "border-blue-500 text-blue-400" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            Audit Snapshots ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("diff")}
            disabled={history.length < 2}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "diff" 
                ? "border-blue-500 text-blue-400" 
                : history.length < 2 
                ? "border-transparent text-gray-600 cursor-not-allowed" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <GitCompare size={14} />
            <span>Version Diff Comparison</span>
            {history.length < 2 && <span className="text-[10px] text-gray-600">(Needs 2+ audits)</span>}
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-500">
                <History size={28} />
              </div>
              <h4 className="text-base font-bold text-white">No Audits Saved Yet</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Generate an audit or scan a repository, and your FinOps snapshots will automatically appear here for side-by-side comparison.
              </p>
            </div>
          ) : activeTab === "list" ? (
            /* LIST VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {history.map((record, idx) => (
                <div
                  key={record.id || idx}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-blue-500/30 transition flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar size={12} className="text-blue-400" />
                        {record.dateFormatted}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                        Score: {record.optimizationScore}/100
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">
                      {record.companyName}
                    </h4>
                    {record.repoName && (
                      <p className="text-[11px] text-blue-400 font-mono mt-0.5">
                        Repo: {record.repoName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase">Spend</p>
                      <p className="text-xs font-bold text-white mt-0.5">${record.totalMonthlySpend}/mo</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase">Savings</p>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5">+${record.totalMonthlySavings}/mo</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase">Tools</p>
                      <p className="text-xs font-bold text-purple-300 mt-0.5">{record.toolsCount} items</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectAudit(record)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white text-xs font-semibold transition"
                  >
                    <span>Load Snapshot into Audit</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* DIFF COMPARISON VIEW */
            <div className="space-y-5">
              {/* SELECTORS FOR AUDIT A & B */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Baseline Audit (Before)
                  </label>
                  <select
                    value={selectedOldId}
                    onChange={(e) => setSelectedOldId(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {history.map((h) => (
                      <option key={h.id} value={h.id} className="bg-gray-900 text-white">
                        {h.dateFormatted} - ${h.totalMonthlySpend}/mo ({h.toolsCount} tools)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Target Audit (After Optimization)
                  </label>
                  <select
                    value={selectedNewId}
                    onChange={(e) => setSelectedNewId(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {history.map((h) => (
                      <option key={h.id} value={h.id} className="bg-gray-900 text-white">
                        {h.dateFormatted} - ${h.totalMonthlySpend}/mo ({h.toolsCount} tools)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {diffResult && (
                <div className="space-y-4">
                  {/* DIFF SUMMARY STATS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Spend Delta</p>
                      <div className={`text-xl font-bold mt-1 ${diffResult.spendDelta < 0 ? "text-emerald-400" : "text-gray-200"}`}>
                        {diffResult.spendDelta < 0 ? `-$${Math.abs(diffResult.spendDelta)}/mo` : `+$${diffResult.spendDelta}/mo`}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {diffResult.spendDelta < 0 ? "Cost reduced" : "Cost expanded"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Savings Delta</p>
                      <div className="text-xl font-bold text-emerald-400 mt-1">
                        {diffResult.savingsDelta >= 0 ? `+$${diffResult.savingsDelta}/mo` : `-$${Math.abs(diffResult.savingsDelta)}/mo`}
                      </div>
                      <p className="text-[10px] text-emerald-400/80 mt-0.5">
                        Net savings change
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Score Progress</p>
                      <div className={`text-xl font-bold mt-1 ${diffResult.scoreDelta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {diffResult.scoreDelta >= 0 ? `+${diffResult.scoreDelta} pts` : `${diffResult.scoreDelta} pts`}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Score efficiency
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Ghost Seats</p>
                      <div className="text-xl font-bold text-purple-300 mt-1">
                        {diffResult.ghostSeatsDelta <= 0 ? `${diffResult.ghostSeatsDelta} seats` : `+${diffResult.ghostSeatsDelta} seats`}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Idle seat change
                      </p>
                    </div>
                  </div>

                  {/* TOOLS MODIFIED */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
                    <h5 className="font-bold text-gray-300">Tool Stack Delta</h5>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {diffResult.addedTools.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium">
                          + Added: {t.tool} ({t.plan})
                        </span>
                      ))}
                      {diffResult.removedTools.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-medium">
                          - Removed: {t.tool} ({t.plan})
                        </span>
                      ))}
                      {diffResult.addedTools.length === 0 && diffResult.removedTools.length === 0 && (
                        <span className="text-gray-500 text-[11px]">Same tools retained across both audit runs.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
