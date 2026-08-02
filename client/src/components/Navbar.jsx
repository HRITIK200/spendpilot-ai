import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, X, Trash2 } from "lucide-react";

function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isDrawerOpen) {
      const savedHistory = JSON.parse(localStorage.getItem("spendpilot_history") || "[]");
      setHistory(savedHistory);
    }
  }, [isDrawerOpen]);

  return (
    <>
      <nav className="w-full border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#030712]/80 no-print">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <Link to="/" className="text-2xl font-bold">
            SpendPilot AI
          </Link>

          <div className="flex items-center gap-6">
            <a href="/#features" className="text-gray-300 hover:text-white transition">
              Features
            </a>

            <a href="/#faq" className="text-gray-300 hover:text-white transition">
              FAQ
            </a>

            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="text-gray-300 hover:text-white transition flex items-center gap-1.5 text-sm md:text-base focus:outline-none"
            >
              <Clock size={16} />
              History
            </button>

            <Link
              to="/audit"
              className="bg-white text-black px-5 py-2 rounded-xl font-medium hover:scale-105 transition"
            >
              Start Audit
            </Link>
          </div>
        </div>
      </nav>

      {/* DRAWER OVERLAY */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 no-print"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* SIDE DRAWER */}
      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-gray-950 border-l border-gray-900 z-50 p-6 shadow-2xl transition-transform duration-300 transform no-print ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="text-blue-400" size={18} />
            Audit History
          </h3>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-400 hover:text-white transition p-1 hover:bg-gray-800 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-100px)] space-y-4 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto text-gray-600 mb-3" size={28} />
              <p className="text-gray-500 text-sm">No past audits found.</p>
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
                  className="bg-gray-900/60 border border-gray-800 hover:border-gray-700 p-4 rounded-2xl flex flex-col justify-between gap-3 group transition"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-gray-500 font-semibold">{formattedDate}</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                        Score: {audit.optimizationScore}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-200 mt-2 truncate">
                      {audit.auditedTools.map(t => t.tool).join(", ")}
                    </p>
                    <p className="text-xs text-emerald-400 mt-1 font-medium">
                      Savings: ${audit.totalMonthlySavings}/mo
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        localStorage.setItem("auditResults", JSON.stringify(audit));
                        setIsDrawerOpen(false);
                        window.location.href = "/results";
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition text-center"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => {
                        const updated = history.filter(h => h._id !== audit._id);
                        localStorage.setItem("spendpilot_history", JSON.stringify(updated));
                        setHistory(updated);
                      }}
                      className="text-gray-500 hover:text-rose-400 border border-gray-800 hover:border-rose-500/20 p-1.5 rounded-lg transition"
                      title="Delete audit record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;