import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, X, Trash2, Cloud, User, LogOut, LogIn, Building, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { getUserReports } from "../api/reportApi";
import { DEMO_AUDITS } from "../data/demoAudits";

function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuditPage = location.pathname === "/audit";

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("my"); // "my" or "demo"
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isDrawerOpen) return;

    if (isAuthenticated) {
      setIsLoadingHistory(true);
      getUserReports()
        .then((reports) => {
          setHistory(reports && reports.length > 0 ? reports : []);
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

  const displayedList = activeTab === "my" ? history : DEMO_AUDITS;

  return (
    <>
      <nav className="w-full border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#030712]/90 no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="text-base xs:text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 shrink-0">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">SpendPilot</span>
            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">AI</span>
          </Link>

          {/* NAV CONTROLS */}
          <div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-4 md:gap-6">
            {/* FEATURES & FAQ (Visible ONLY on home page) */}
            {isHomePage && (
              <>
                <a href="#features" className="hidden md:inline-block text-gray-300 hover:text-white text-sm transition">
                  Features
                </a>

                <a href="#faq" className="hidden md:inline-block text-gray-300 hover:text-white text-sm transition">
                  FAQ
                </a>
              </>
            )}

            {/* AUDIT HISTORY BUTTON (Visible ONLY when user is logged in) */}
            {isAuthenticated && (
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="text-gray-200 hover:text-white transition flex items-center gap-1.5 text-xs sm:text-sm focus:outline-none px-2 sm:px-2.5 py-1.5 rounded-xl hover:bg-white/10 border border-white/10 bg-white/[0.04]"
                title="View your cloud audit history"
              >
                <Cloud size={14} className="text-blue-400 shrink-0" />
                <span className="inline">History</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </button>
            )}

            {/* AUTH / USER PROFILE */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-3 bg-white/5 border border-white/10 rounded-xl px-2 py-1 sm:px-3 sm:py-1.5">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white uppercase shadow-sm shrink-0">
                  {user?.name ? user.name.slice(0, 2) : <User size={13} />}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight truncate max-w-[110px]">{user?.name}</span>
                  {user?.company && (
                    <span className="text-[10px] text-gray-400 leading-tight truncate max-w-[110px] flex items-center gap-0.5">
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
                  <LogOut size={13} />
                </button>
              </div>
            ) : !isHomePage ? (
              <button
                onClick={() => openAuthModal("login")}
                className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 transition flex items-center gap-1"
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>
            ) : null}

            {/* START AUDIT CTA (Hidden when on audit form page) */}
            {!isAuditPage && (
              <Link
                to="/audit"
                className="bg-white hover:bg-gray-100 text-black px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-white/10 transition active:scale-95 shrink-0"
              >
                Start Audit
              </Link>
            )}
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

      {/* SIDE DRAWER (Fully Responsive on All Devices) */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[420px] max-w-[100vw] bg-[#090d16] border-l border-white/10 z-50 p-4 sm:p-6 shadow-2xl transition-transform duration-300 transform no-print flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Clock className="text-blue-400" size={18} />
              Audit History
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isAuthenticated ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  ● Cloud-synced for {user?.email}
                </span>
              ) : (
                <span>Accessible without login · Local browser storage</span>
              )}
            </p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-xl"
            aria-label="Close history drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch: Personal History vs Demo Examples */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 my-3">
          <button
            type="button"
            onClick={() => setActiveTab("my")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "my"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            My Past Audits ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("demo")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "demo"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Sparkles size={12} className="text-amber-400" />
            Demo Audits ({DEMO_AUDITS.length})
          </button>
        </div>

        {!isAuthenticated && activeTab === "my" && (
          <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between gap-2">
            <p className="text-xs text-blue-300 leading-tight">
              Sign in to sync your audits across multiple devices.
            </p>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                openAuthModal("login");
              }}
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-xl shrink-0 transition"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Audit Cards List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-6">
          {isLoadingHistory ? (
            <div className="text-center py-16">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-400 text-xs">Loading audit history...</p>
            </div>
          ) : displayedList.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
              <Clock className="mx-auto text-gray-600 mb-3" size={32} />
              <p className="text-gray-300 text-sm font-semibold">No personal audits yet.</p>
              <p className="text-gray-500 text-xs mt-1 mb-4 leading-relaxed">
                You haven't run any audits in this browser yet. Try a demo report or start your first 60-second audit!
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => setActiveTab("demo")}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 py-2 px-3 rounded-xl border border-blue-500/30 bg-blue-500/10 transition"
                >
                  View Demo Reports
                </button>
                <Link
                  to="/audit"
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-xs font-semibold text-black bg-white hover:bg-gray-200 py-2 px-3 rounded-xl transition text-center"
                >
                  Start New Audit
                </Link>
              </div>
            </div>
          ) : (
            displayedList.map((audit) => {
              const date = new Date(audit.createdAt);
              const formattedDate = isNaN(date.getTime()) 
                ? "Recent Audit" 
                : date.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  });
              return (
                <div 
                  key={audit._id}
                  className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/30 p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between gap-3 group transition shadow-lg"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400 font-medium">{formattedDate}</span>
                        {audit.isDemo && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
                            Demo
                          </span>
                        )}
                        {audit.company && (
                          <span className="text-[10px] text-blue-300 font-medium truncate max-w-[120px]">
                            • {audit.company}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md shrink-0">
                        Score: {audit.optimizationScore}/100
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-gray-100 mt-2 truncate">
                      {(audit.auditedTools || []).map((t) => t.tool).join(", ") || "AI Stack Audit"}
                    </p>

                    <div className="flex items-center justify-between text-xs mt-1.5">
                      <span className="text-emerald-400 font-bold">
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
                        window.location.href = "/results";
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition text-center shadow-md flex items-center justify-center gap-1"
                    >
                      <span>View Report</span>
                      <ArrowRight size={13} />
                    </button>

                    {!isAuthenticated && !audit.isDemo && (
                      <button
                        onClick={() => {
                          const updated = history.filter((h) => h._id !== audit._id);
                          localStorage.setItem("spendpilot_history", JSON.stringify(updated));
                          setHistory(updated);
                        }}
                        className="text-gray-500 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 p-2 rounded-xl transition"
                        title="Delete local record"
                        aria-label="Delete local audit"
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