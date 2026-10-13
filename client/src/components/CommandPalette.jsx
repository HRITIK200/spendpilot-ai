import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  GitBranch,
  Layers,
  Terminal,
  Rocket,
  Building2,
  HelpCircle,
  Cpu,
  ArrowRight,
  ExternalLink,
  X,
  FileSpreadsheet,
  Command
} from "lucide-react";

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Define command items
  const commands = [
    // Core Actions
    {
      id: "start-audit",
      category: "Audit & Simulator",
      title: "Start Free AI Spend Audit",
      description: "Analyze team seats, subscription plans, and potential savings",
      icon: <Sparkles size={16} className="text-blue-400" />,
      action: () => navigate("/audit"),
    },
    {
      id: "scan-repo",
      category: "Audit & Simulator",
      title: "Scan GitHub Repository",
      description: "Detect AI dependencies and auto-fill tooling audit",
      icon: <GitBranch size={16} className="text-indigo-400" />,
      action: () => {
        navigate("/#repo-scanner");
        const el = document.getElementById("repo-scanner");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "preset-engineering",
      category: "Sample Stacks",
      title: "Load Dev & Engineering Stack",
      description: "Cursor Pro, GitHub Copilot Business, Claude Team (25 seats)",
      icon: <Terminal size={16} className="text-blue-400" />,
      action: () => {
        navigate("/audit", {
          state: {
            prefilledTools: [
              { id: 1, tool: "Cursor", plan: "Pro", monthlyCost: 20, seats: 10, useCase: "coding" },
              { id: 2, tool: "GitHub Copilot", plan: "Business", monthlyCost: 19, seats: 10, useCase: "coding" },
              { id: 3, tool: "Claude", plan: "Team", monthlyCost: 30, seats: 5, useCase: "research" },
            ],
            repoName: "Engineering Sample Preset",
          },
        });
      },
    },
    {
      id: "preset-startup",
      category: "Sample Stacks",
      title: "Load Startup Core Stack",
      description: "ChatGPT Team, Cursor Pro, Gemini Pro (25 seats)",
      icon: <Rocket size={16} className="text-purple-400" />,
      action: () => {
        navigate("/audit", {
          state: {
            prefilledTools: [
              { id: 1, tool: "ChatGPT", plan: "Team", monthlyCost: 30, seats: 12, useCase: "mixed" },
              { id: 2, tool: "Cursor", plan: "Pro", monthlyCost: 20, seats: 8, useCase: "coding" },
              { id: 3, tool: "Gemini", plan: "Pro", monthlyCost: 20, seats: 5, useCase: "research" },
            ],
            repoName: "Startup Core Preset",
          },
        });
      },
    },
    {
      id: "preset-enterprise",
      category: "Sample Stacks",
      title: "Load Enterprise AI Stack",
      description: "ChatGPT Enterprise, Claude Enterprise, OpenAI API (60 seats)",
      icon: <Building2 size={16} className="text-emerald-400" />,
      action: () => {
        navigate("/audit", {
          state: {
            prefilledTools: [
              { id: 1, tool: "ChatGPT", plan: "Enterprise", monthlyCost: 60, seats: 25, useCase: "mixed" },
              { id: 2, tool: "Claude", plan: "Enterprise", monthlyCost: 60, seats: 20, useCase: "writing" },
              { id: 3, tool: "OpenAI API", plan: "Growth", monthlyCost: 200, seats: 15, useCase: "coding" },
            ],
            repoName: "Enterprise Preset",
          },
        });
      },
    },

    // AI Tool Directory
    {
      id: "tool-chatgpt",
      category: "AI Tool Directory",
      title: "ChatGPT (OpenAI)",
      description: "Plus ($20), Team ($30), Enterprise ($60/seat/mo)",
      icon: <Cpu size={16} className="text-emerald-400" />,
      action: () => {
        navigate("/audit", {
          state: {
            prefilledTools: [{ id: 1, tool: "ChatGPT", plan: "Team", monthlyCost: 30, seats: 5, useCase: "mixed" }],
          },
        });
      },
    },
    {
      id: "tool-claude",
      category: "AI Tool Directory",
      title: "Claude (Anthropic)",
      description: "Pro ($20), Team ($30), Enterprise ($60/seat/mo)",
      icon: <Cpu size={16} className="text-amber-400" />,
      action: () => {
        navigate("/audit", {
          state: {
            prefilledTools: [{ id: 1, tool: "Claude", plan: "Team", monthlyCost: 30, seats: 5, useCase: "research" }],
          },
        });
      },
    },
    {
      id: "tool-cursor",
      category: "AI Tool Directory",
      title: "Cursor AI Code Editor",
      description: "Pro ($20), Business ($40), Enterprise ($60/seat/mo)",
      icon: <Cpu size={16} className="text-blue-400" />,
      action: () => {
        navigate("/audit", {
          state: {
            prefilledTools: [{ id: 1, tool: "Cursor", plan: "Pro", monthlyCost: 20, seats: 8, useCase: "coding" }],
          },
        });
      },
    },
    {
      id: "tool-copilot",
      category: "AI Tool Directory",
      title: "GitHub Copilot",
      description: "Individual ($10), Business ($19), Enterprise ($39/seat/mo)",
      icon: <Cpu size={16} className="text-purple-400" />,
      action: () => {
        navigate("/audit", {
          state: {
            prefilledTools: [{ id: 1, tool: "GitHub Copilot", plan: "Business", monthlyCost: 19, seats: 10, useCase: "coding" }],
          },
        });
      },
    },

    // Navigation & Platform
    {
      id: "nav-home",
      category: "Navigation",
      title: "Go to Home Page",
      description: "SpendPilot AI platform overview & calculator",
      icon: <Layers size={16} className="text-gray-400" />,
      action: () => navigate("/"),
    },
    {
      id: "nav-features",
      category: "Navigation",
      title: "Platform Features",
      description: "Right-sizing engine, What-If simulator, FinOps reports",
      icon: <Sparkles size={16} className="text-purple-400" />,
      action: () => {
        navigate("/#features");
        const el = document.getElementById("features");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "nav-faq",
      category: "Navigation",
      title: "Frequently Asked Questions",
      description: "Learn about calculations, privacy, and security",
      icon: <HelpCircle size={16} className="text-blue-400" />,
      action: () => {
        navigate("/#faq");
        const el = document.getElementById("faq");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "nav-github",
      category: "External",
      title: "View Source on GitHub",
      description: "Open-source SpendPilot AI repository",
      icon: <ExternalLink size={16} className="text-gray-400" />,
      action: () => window.open("https://github.com/HRITIK200/spendpilot-ai", "_blank"),
    },
  ];

  // Filter commands
  const filtered = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle keyboard navigation inside palette
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        executeCommand(filtered[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const executeCommand = (cmd) => {
    onClose();
    cmd.action();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#090d19] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* INPUT HEADER */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tools (e.g. Cursor, Audit, Repo)..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-500 hover:text-gray-300 p-1"
            >
              <X size={14} />
            </button>
          )}
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-400 border border-white/10 hidden sm:inline">
            esc
          </span>
        </div>

        {/* RESULTS LIST */}
        <div className="overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs sm:text-sm">
              <Command size={28} className="mx-auto mb-2 text-gray-600" />
              <p>No matching commands or tools found.</p>
              <p className="text-[11px] text-gray-500 mt-1">Try searching for "audit", "cursor", "repo", or "preset".</p>
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition ${
                    isSelected
                      ? "bg-blue-600/15 border border-blue-500/30 text-white"
                      : "bg-transparent text-gray-300 hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate text-white">
                        {cmd.title}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {cmd.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] text-gray-500 font-mono hidden md:inline">
                      {cmd.category}
                    </span>
                    {isSelected && (
                      <ArrowRight size={14} className="text-blue-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* FOOTER BAR */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400 font-mono text-[10px]">↑↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400 font-mono text-[10px]">↵</kbd> to select
            </span>
          </div>
          <span className="text-[10px] text-gray-500">SpendPilot AI Command Menu</span>
        </div>
      </div>
    </div>
  );
}
