import { useState } from "react";
import { X, Copy, Check, Share2, Sparkles } from "lucide-react";

export default function ShareAuditModal({ isOpen, onClose, auditData, setToast }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const monthlySavings = Number(auditData?.totalMonthlySavings || 0);
  const annualSavings = Number(auditData?.totalAnnualSavings || monthlySavings * 12);
  const score = auditData?.optimizationScore || 85;

  const shareUrl = window.location.href;
  const shareText = `💸 We audited our engineering AI stack with SpendPilot AI and uncovered $${monthlySavings.toLocaleString()}/mo ($${annualSavings.toLocaleString()}/yr) in dormant seats & model right-sizing opportunities! (Score: ${score}/100). Check your AI ROI:`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    if (setToast) setToast({ message: "Share link copied to clipboard!", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  const shareToWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#090e1d] border border-white/10 rounded-3xl shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Share2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Share Your AI ROI Report</h3>
            <p className="text-xs text-gray-400">Highlight your team's FinOps savings with your network</p>
          </div>
        </div>

        {/* PREVIEW CARD */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 mb-5">
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            "{shareText}"
          </p>
          <p className="text-[11px] text-blue-400 font-mono truncate">{shareUrl}</p>
        </div>

        {/* SHARE PLATFORM BUTTONS */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <button
            type="button"
            onClick={shareToTwitter}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition"
          >
            <span>Post on X</span>
          </button>

          <button
            type="button"
            onClick={shareToLinkedIn}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold transition"
          >
            <span>LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={shareToWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
          >
            <span>WhatsApp</span>
          </button>
        </div>

        {/* COPY LINK BUTTON */}
        <button
          type="button"
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition active:scale-95"
        >
          {copied ? (
            <>
              <Check size={16} className="text-emerald-300" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy Shareable Text & Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
