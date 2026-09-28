import React, { useState, useEffect } from "react";
import { Mail, X, Send, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { sendReportEmail } from "../api/reportApi";
import { useAuth } from "../context/AuthContext";

export default function EmailReportModal({ isOpen, onClose, reportId, reportData, onEmailSent }) {
  const { user } = useAuth();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (user?.name) {
      setSenderName(user.name + (user.company ? ` (${user.company})` : ""));
    } else {
      setSenderName("FinOps Lead");
    }
    setStatusMessage(null);
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientEmail || !recipientEmail.includes("@")) {
      setStatusMessage({ type: "error", text: "Please provide a valid recipient email address." });
      return;
    }

    if (!reportId) {
      setStatusMessage({ type: "error", text: "Report ID missing. Please ensure report is saved first." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await sendReportEmail(reportId, {
        recipientEmail: recipientEmail.trim(),
        senderName: senderName.trim() || "FinOps Lead",
        notes: notes.trim(),
      });

      setStatusMessage({
        type: "success",
        text: res.message || `Executive report successfully dispatched to ${recipientEmail}!`,
      });

      if (onEmailSent) {
        onEmailSent(res.message);
      }

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Email delivery failed:", err);
      const errText = err.response?.data?.message || "Failed to dispatch executive report email. Please try again.";
      setStatusMessage({ type: "error", text: errText });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md no-print animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={!isSubmitting ? onClose : undefined} 
      />

      <div className="relative w-full max-w-lg bg-[#0d1322] border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition p-1.5 hover:bg-white/5 rounded-xl disabled:opacity-50"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Mail size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Email Executive Audit</h3>
            <p className="text-gray-400 text-xs mt-0.5">Send a high-impact FinOps summary directly to decision makers</p>
          </div>
        </div>

        {/* Brief Preview of Metrics */}
        {reportData && (
          <div className="my-5 p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Monthly Savings</div>
              <div className="text-sm sm:text-base font-extrabold text-emerald-400 mt-0.5">
                ${reportData.totalMonthlySavings || 0}/mo
              </div>
            </div>
            <div className="border-x border-white/5">
              <div className="text-[10px] uppercase font-bold text-gray-400">Annual Savings</div>
              <div className="text-sm sm:text-base font-extrabold text-blue-400 mt-0.5">
                ${reportData.totalAnnualSavings || 0}/yr
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Efficiency</div>
              <div className="text-sm sm:text-base font-extrabold text-purple-400 mt-0.5">
                {reportData.optimizationScore || 100}/100
              </div>
            </div>
          </div>
        )}

        {statusMessage && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
            }`}
          >
            {statusMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Recipient Email <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. cfo@company.com or finance@organization.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Sender Name / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan, VP Engineering"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Executive Context / Notes <span className="text-gray-500 text-[11px]">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Hi team, please review our AI SaaS spend analysis. We found substantial duplication across code assistants and overprovisioned chat tiers."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Dispatching Executive Email...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Send Executive Audit Report</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-gray-500 text-center">
            Delivered in responsive HTML with direct link to interactive audit breakdown.
          </p>
        </form>
      </div>
    </div>
  );
}
