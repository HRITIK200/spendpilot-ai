import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Lock, Mail, Building, User, ArrowRight, Loader2, Sparkles, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AuthModal = () => {
  const navigate = useNavigate();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authModalMode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error("Full name is required");
        }
        await register({ name, email, password, company });
      }
      // Reset fields
      setName("");
      setEmail("");
      setPassword("");
      setCompany("");
      closeAuthModal();
      // Redirect to /audit page upon login/register
      navigate("/audit");
    } catch (err) {
      console.error("Auth submit error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Authentication failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("alex@spendpilot.demo");
    setPassword("DemoPass123!");
    if (authModalMode === "register") {
      setName("Alex Morgan");
      setCompany("Apex Engineering");
    }
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-md animate-toast-in no-print">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      <div className="relative w-full max-w-md bg-[#0d1322] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-white transition p-1.5 rounded-xl hover:bg-white/10 focus:outline-none"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-2.5">
            <Sparkles size={12} />
            SpendPilot FinOps Access
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {authModalMode === "login" ? "Welcome Back" : "Create FinOps Account"}
          </h3>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
            {authModalMode === "login"
              ? "Sign in to access your team's cloud-synced audit history & simulator."
              : "Register to unlock full AI SaaS audits, cloud sync, and executive PDF reports."}
          </p>
        </div>

        {/* Value Proposition Pills */}
        <div className="grid grid-cols-2 gap-2 mb-5 p-2.5 bg-white/[0.03] border border-white/5 rounded-2xl text-[11px] text-gray-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span>Cloud Audit History</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span>Interactive Simulator</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span>Executive Email Reports</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-blue-400 shrink-0" />
            <span>Enterprise Security</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode("login");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              authModalMode === "login"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode("register");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              authModalMode === "register"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <p className="leading-tight">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === "register" && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                  Company / Organization <span className="text-gray-500 text-[10px]">(Optional)</span>
                </label>
                <div className="relative">
                  <Building
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
              Work Email <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-11 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-1 rounded-md focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {authModalMode === "register" && (
              <p className="text-[10px] text-gray-500 mt-0.5">
                Must be at least 6 characters.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={17} />
            ) : (
              <>
                <span>
                  {authModalMode === "login" ? "Sign In & Continue to Audit" : "Create Account & Start Audit"}
                </span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Helper Button */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-gray-500">Testing the app?</span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-blue-400 hover:text-blue-300 font-semibold underline decoration-blue-500/40 hover:decoration-blue-400"
          >
            Auto-fill demo credentials
          </button>
        </div>

        {/* Switch tab footer */}
        <div className="mt-3 text-center text-xs text-gray-500">
          {authModalMode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode("register");
                  setError("");
                }}
                className="text-blue-400 hover:underline font-semibold"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode("login");
                  setError("");
                }}
                className="text-blue-400 hover:underline font-semibold"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
