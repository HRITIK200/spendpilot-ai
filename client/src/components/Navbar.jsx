import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, X, Trash2, Cloud, User, LogOut, LogIn, Building } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { getUserReports } from "../api/reportApi";

function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isDrawerOpen) return;

    if (isAuthenticated) {
      setIsLoadingHistory(true);
      getUserReports()
        .then((reports) => {
          setHistory(reports || []);
        })
        .catch((err) => {
          console.error("Failed to fetch cloud history, falling back to local:", err);
          const local = JSON.parse(localStorage.getItem("spendpilot_history") || "[]");
          setHistory(local);
        })
        .finally(() => {
          setIsLoadingHistory(false);
        });
    } else {
      const savedHistory = JSON.parse(localStorage.getItem("spendpilot_history") || "[]");
      setHistory(savedHistory);
    }
  }, [isDrawerOpen, isAuthenticated]);

  return (
    <>
      <nav className="w-full border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#030712]/80 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <Link to="/" className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">SpendPilot</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">AI</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <a href="/#features" className="hidden md:inline-block text-gray-300 hover:text-white text-sm transition">
              Features
            </a>

            <a href="/#faq" className="hidden md:inline-block text-gray-300 hover:text-white text-sm transition">
              FAQ
            </a>

            {/* AUDIT HISTORY BUTTON */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="text-gray-300 hover:text-white transition flex items-center gap-1.5 text-xs sm:text-sm focus:outline-none px-2.5 py-1.5 rounded-lg hover:bg-white/5 border border-white/5"
              title="View your audit history"
            >
              {isAuthenticated ? <Cloud size={14} className="text-blue-400" /> : <Clock size={14} />}
              <span className="hidden xs:inline">History</span>
              {isAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>

            {/* AUTH / USER PROFILE */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                  {user?.name ? user.name.slice(0, 2) : <User size={13} />}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">{user?.name}</span>
                  {user?.company && (
                    <span className="text-[10px] text-gray-400 leading-tight truncate max-w-[120px] flex items-center gap-0.5">
                      <Building size={9} /> {user.company}
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-rose-400 transition p-1 hover:bg-white/5 rounded-md"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition flex items-center gap-1.5"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )}

            {/* START AUDIT CTA */}
            <Link
              to="/audit"
              className="bg-white hover:bg-gray-100 text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-white/10 transition active:scale-95"
            >
              Start Audit
            </Link>
          </div>
        </div>
      </nav>

      {/* DRAWER OVERLAY */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 no-print transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* SIDE DRAWER */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 max-w-[92vw] bg-[#0b0f19] border-l border-white/10 z-50 p-5 sm:p-6 shadow-2xl transition-transform duration-300 transform no-print flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {isAuthenticated ? <Cloud className="text-blue-400" size={18} /> : <Clock className="text-blue-400" size={18} />}
              Audit History
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isAuthenticated ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  ● Cloud-synced for {user?.email}
                </span>
              ) : (
                <span>Stored locally in browser</span>
              )}
            </p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-400 hover:text-white transition p-1.5 hover:bg-white/10 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {!isAuthenticated && (
          <div className="my-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between gap-2">
            <p className="text-xs text-blue-300">
              Sign in to sync your audits across devices.
            </p>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                openAuthModal("login");
              }}
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg shrink-0 transition"
            >
              Sign In
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mt-3">
          {isLoadingHistory ? (
            <div className="text-center py-16">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-400 text-xs">Loading audit history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="mx-auto text-gray-600 mb-3" size={32} />
              <p className="text-gray-400 text-sm font-medium">No past audits found.</p>
              <p className="text-gray-600 text-xs mt-1">Run an audit to see your cost optimization history here.</p>
            </div>
          ) : (
            history.map((audit) => {
              const date = new Date(audit.createdAt);
              const formattedDate = isNaN(date.getTime()) 
                ? "Recent Report" 
                : date.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  });
              return (
                <div 
                  key={audit._id}
                  className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/30 p-3.5 rounded-2xl flex flex-col justify-between gap-3 group transition"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-gray-400 font-medium">{formattedDate}</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        Score: {audit.optimizationScore}/100
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-200 mt-2 truncate">
                      {(audit.auditedTools || []).map((t) => t.tool).join(", ") || "Custom Audit"}
                    </p>
                    <div className="flex items-center justify-between text-xs mt-1.5">
                      <span className="text-emerald-400 font-semibold">
                        ${audit.totalMonthlySavings || 0}/mo savings
                      </span>
                      <span className="text-gray-400 text-[11px]">
                        ${audit.totalAnnualSavings || 0}/yr
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        localStorage.setItem("auditResults", JSON.stringify(audit));
                        setIsDrawerOpen(false);
                        window.location.href = `/report/${audit._id}`;
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition text-center shadow-sm"
                    >
                      View Report
                    </button>
                    {!isAuthenticated && (
                      <button
                        onClick={() => {
                          const updated = history.filter((h) => h._id !== audit._id);
                          localStorage.setItem("spendpilot_history", JSON.stringify(updated));
                          setHistory(updated);
                        }}
                        className="text-gray-500 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 p-1.5 rounded-lg transition"
                        title="Delete local record"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* AUTH MODAL */}
      <AuthModal />
    </>
  );
}

export default Navbar;