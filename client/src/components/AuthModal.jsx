import React, { useState } from "react";
import { X, Lock, Mail, Building, User, ArrowRight, Loader2, Sparkles, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AuthModal = () => {
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
    } catch (err) {
      console.error("Auth submit error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Authentication failed. Please verify your details.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-toast-in no-print">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-5 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition p-1.5 rounded-xl hover:bg-gray-800 focus:outline-none"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            SpendPilot Cloud Account
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {authModalMode === "login" ? "Welcome back" : "Create FinOps Account"}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {authModalMode === "login"
              ? "Sign in to access your cloud-synced company audit history."
              : "Register to save and manage team AI subscription audits across all devices."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-950/60 p-1 rounded-2xl border border-gray-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode("login");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              authModalMode === "login"
                ? "bg-blue-600 text-white shadow-lg"
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
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              authModalMode === "register"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
            <p className="leading-tight">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === "register" && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-950/80 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Company / Organization (Optional)
                </label>
                <div className="relative">
                  <Building
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-gray-950/80 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950/80 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950/80 border border-gray-800 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-1 rounded-md focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {authModalMode === "register" && (
              <p className="text-[11px] text-gray-500 mt-1">
                Must be at least 6 characters.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <span>
                  {authModalMode === "login" ? "Sign In to Account" : "Complete Registration"}
                </span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-gray-500">
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
