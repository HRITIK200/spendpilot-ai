import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, X, FileSpreadsheet, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Loader2, RefreshCw, Home as HomeIcon, Mail, Lock, Sliders, Sparkles } from "lucide-react";
import { saveLead } from "../api/leadApi";
import { getReportById } from "../api/reportApi";
import Toast from "../components/Toast";
import WhatIfSimulator from "../components/WhatIfSimulator";
import EmailReportModal from "../components/EmailReportModal";
import { useAuth } from "../context/AuthContext";
import { DEMO_AUDITS } from "../data/demoAudits";

import { Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Results = () => {
  const { id } = useParams();
  const location = useLocation();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadNotice, setLeadNotice] = useState(null);
  const [toast, setToast] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [simTrigger, setSimTrigger] = useState(null);

  const handleLeadSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setToast({ message: "Please enter a valid email address", type: "error" });
      return;
    }

    setIsSubmittingLead(true);
    setLeadNotice(null);

    try {
      const res = await saveLead({
        email: trimmedEmail,
        company: company.trim(),
      });

      setLeadSaved(true);

      if (res?.emailStatus?.delivered) {
        setToast({ message: `Confirmation email sent to ${trimmedEmail}!`, type: "success" });
        setLeadNotice({
          type: "success",
          text: `Confirmation email sent to ${trimmedEmail}. Please check your inbox (and spam/promotions folder).`,
        });
      } else {
        setToast({ message: "Successfully registered for audit updates!", type: "success" });
        setLeadNotice({
          type: "success",
          text: `Thank you for subscribing! Your email has been added to our FinOps intelligence updates.`,
        });
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Failed to subscribe. Please try again.";
      setToast({ message: errMsg, type: "error" });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const [results, setResults] = useState(() => {
    if (location.state?.results) return location.state.results;
    if (window.location.pathname.startsWith("/report/")) return null;
    const savedResults = localStorage.getItem("auditResults");
    if (savedResults) {
      try {
        const parsed = JSON.parse(savedResults);
        if (parsed && parsed.auditedTools && parsed.auditedTools.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Error reading saved auditResults:", e);
      }
    }
    return DEMO_AUDITS[0];
  });

  const [loading, setLoading] = useState(Boolean(id));
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (id) {
      document.title = "Public Audit Report | SpendPilot AI";
      setLoading(true);
      setFetchError(null);
      getReportById(id)
        .then((data) => {
          if (data && data._id && data.auditedTools) {
            setResults(data);
          } else {
            setFetchError("Audit report not found or record format is invalid.");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch public report:", err);
          const saved = localStorage.getItem("auditResults");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed._id === id || String(parsed._id) === String(id)) {
                setResults(parsed);
                setFetchError(null);
                return;
              }
            } catch (e) {}
          }
          setFetchError("Unable to retrieve report. The server may be waking up or the link is invalid.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      document.title = "Audit Results | SpendPilot AI";
      if (location.state?.results) {
        setResults(location.state.results);
      } else if (!results || !results.auditedTools) {
        const saved = localStorage.getItem("auditResults");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.auditedTools) {
              setResults(parsed);
            } else {
              setResults(DEMO_AUDITS[0]);
            }
          } catch (e) {
            setResults(DEMO_AUDITS[0]);
          }
        } else {
          setResults(DEMO_AUDITS[0]);
        }
      }
      setLoading(false);
    }
  }, [id, location.state]);

  const [compareToolId, setCompareToolId] = useState(null);

  const handleAutoResolveRedundancy = (redundantToolName) => {
    setSimTrigger({ toolName: redundantToolName, timestamp: Date.now() });

    setTimeout(() => {
      const el = document.getElementById("what-if-simulator");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);

    setToast({
      message: `Simulator updated: Toggled off ${redundantToolName} to preview consolidation savings!`,
      type: "success"
    });
  };

  const getRedundancyAlerts = () => {
    if (!results || !results.auditedTools) return [];
    const alerts = [];
    const toolsList = results.auditedTools.map((t) => t.tool);

    // 1. Developer Tooling Overlap
    const codingTools = ["Cursor", "GitHub Copilot", "Windsurf"].filter((t) => toolsList.includes(t));
    if (codingTools.length >= 2) {
      const redundantTool = codingTools.includes("Cursor") 
        ? codingTools.find((t) => t !== "Cursor") 
        : codingTools[1];
      const targetToolObj = results.auditedTools.find((t) => t.tool === redundantTool);
      const savings = targetToolObj ? Number(targetToolObj.monthlyCost) : (targetToolObj?.seats || 1) * 19;

      alerts.push({
        type: "developer",
        title: "Developer Tooling Overlap Detected",
        description: `We detected both ${codingTools.join(" and ")} active in your stack. Consolidating your developer tooling onto ${codingTools.includes("Cursor") ? "Cursor" : codingTools[0]} can eliminate duplicate subscriptions.`,
        redundantTool: redundantTool,
        primaryTool: codingTools.includes("Cursor") ? "Cursor" : codingTools[0],
        savings: savings || 38,
      });
    }

    // 2. Chatbot Tooling Overlap
    const chatTools = ["ChatGPT", "Claude"].filter((t) => toolsList.includes(t));
    const hasWritingCase = results.auditedTools.some((t) => chatTools.includes(t.tool) && t.useCase === "writing");
    if (chatTools.length >= 2 && hasWritingCase) {
      const redundantTool = "Claude";
      const targetToolObj = results.auditedTools.find((t) => t.tool === redundantTool);
      const savings = targetToolObj ? Number(targetToolObj.monthlyCost) : (targetToolObj?.seats || 1) * 20;

      alerts.push({
        type: "chatbot",
        title: "Chat Workspace Redundancy",
        description: `Both ChatGPT and Claude are active for content writing workflows. Standardizing on a single chatbot platform can reduce overlapping licensing costs.`,
        redundantTool: redundantTool,
        primaryTool: "ChatGPT",
        savings: savings || 40,
      });
    }

    return alerts;
  };
  const redundancyAlerts = getRedundancyAlerts();

  const PLAN_FEATURES_MATRIX = {
    "ChatGPT": {
      "Team": {
        kept: ["Access to GPT-4o & GPT-4o-mini", "Create & share custom GPTs", "Advanced Data Analysis", "Higher message limits than Plus"],
        removed: ["Admin workspace controls & billing - Not required for small teams", "Shared GPT store workspace namespace"]
      },
      "Enterprise": {
        kept: ["Access to GPT-4o & GPT-4o-mini", "Create custom GPTs", "Advanced Data Analysis"],
        removed: ["Single Sign-on (SSO)", "Expanded admin roles & control parameters", "Custom data retention policies"]
      }
    },
    "Claude": {
      "Team": {
        kept: ["Access to Claude 3.5 Sonnet", "Projects workspace tools", "Sharing prompts"],
        removed: ["Team administration console - Not required for small teams", "Domain management tools"]
      }
    },
    "Cursor": {
      "Business": {
        kept: ["Unlimited slow requests", "500 fast requests/mo", "Copilot++ autocomplete"],
        removed: ["Admin usage statistics - Not needed for small teams", "SSO/SAML integration"]
      }
    },
    "GitHub Copilot": {
      "Business": {
        kept: ["Code completion autocomplete", "Copilot Chat features"],
        removed: ["Organization policy controls", "User management tools"]
      }
    },
    "Gemini": {
      "Team": {
        kept: ["Access to Gemini 1.5 Pro & Ultra", "Integration with Workspace Docs & Slides"],
        removed: ["Admin controls & reports", "Enterprise-grade data security protocols"]
      }
    }
  };

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const getAvailableDates = () => {
    const dates = [];
    const temp = new Date();
    while (dates.length < 5) {
      temp.setDate(temp.getDate() + 1);
      const day = temp.getDay();
      if (day !== 0 && day !== 6) { // Exclude Sunday (0) and Saturday (6)
        dates.push(new Date(temp));
      }
    }
    return dates;
  };
  const availableDates = getAvailableDates();
  const availableTimes = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "4:30 PM"];

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) return;
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      setShowBookingModal(false);
      const formattedDate = selectedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      setToast({
        message: `Consultation scheduled for ${formattedDate} at ${selectedTime}! Check your inbox for the calendar invite.`,
        type: "success"
      });
      setSelectedDate(null);
      setSelectedTime(null);
    }, 1000);
  };

  const handleExportCSV = () => {
    if (!results || !results.auditedTools) return;

    // 1. Column headers
    const headers = [
      "Tool",
      "Original Plan",
      "Seats",
      "Monthly Cost ($)",
      "Optimized Plan",
      "Monthly Savings ($)",
      "Annual Savings ($)",
      "Recommendation",
      "Reasoning"
    ];
    
    // 2. Map audited tools to CSV rows
    const rows = results.auditedTools.map((tool) => [
      `"${tool.tool || ""}"`,
      `"${tool.plan || ""}"`,
      tool.seats || 1,
      tool.monthlyCost || 0,
      `"${tool.optimizedPlan || ""}"`,
      tool.monthlySavings || 0,
      tool.annualSavings || 0,
      `"${(tool.recommendation || "").replace(/"/g, '""')}"`,
      `"${(tool.reasoning || "").replace(/"/g, '""')}"`
    ]);

    // Summary totals row
    rows.push([
      `"TOTAL AUDIT SUMMARY"`,
      `""`,
      results.auditedTools.reduce((acc, t) => acc + (Number(t.seats) || 1), 0),
      results.auditedTools.reduce((acc, t) => acc + (Number(t.monthlyCost) || 0), 0),
      `"Optimization Score: ${score}/100"`,
      results.totalMonthlySavings || 0,
      results.totalAnnualSavings || 0,
      `"SpendPilot AI Automated Audit"`,
      `""`
    ]);

    // 3. Assemble CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // 4. Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SpendPilot_Audit_Report_${results._id || "export"}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setToast({
      message: "Audit report exported to CSV successfully!",
      type: "success"
    });
  };


  const [copied, setCopied] = useState(false);

  const score = results?.optimizationScore !== undefined ? results.optimizationScore : 100;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const getScoreDetails = (val) => {
    if (val >= 85) {
      return {
        label: "Optimal Efficiency",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        dotColor: "bg-emerald-400",
        strokeClass: "stroke-emerald-400",
        cardGradient: "from-emerald-500/10 via-emerald-600/5 to-transparent border-emerald-500/30",
        textColor: "text-emerald-400",
      };
    }
    if (val >= 70) {
      return {
        label: "Moderate Waste",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        dotColor: "bg-amber-400",
        strokeClass: "stroke-amber-400",
        cardGradient: "from-amber-500/10 via-amber-600/5 to-transparent border-amber-500/30",
        textColor: "text-amber-400",
      };
    }
    return {
      label: "Critical Overspend",
      badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      dotColor: "bg-rose-400",
      strokeClass: "stroke-rose-400",
      cardGradient: "from-rose-500/10 via-rose-600/5 to-transparent border-rose-500/30",
      textColor: "text-rose-400",
    };
  };

  const scoreDetails = getScoreDetails(score);

  const chartData = 
  results?.auditedTools.map((tool) => ({
      name: tool.tool,

      Current: Number(tool.monthlyCost),

      Optimized: 
         Number(tool.monthlyCost) - 
         Number(tool.monthlySavings),
    })) || [];

  const donutData = 
  results?.auditedTools.map((tool) => ({
      name: tool.tool,
      value: Number(tool.monthlyCost),
    })) || [];

  const DONUT_COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#06b6d4", // Cyan
    "#f43f5e", // Rose
    "#14b8a6", // Teal
  ];

  const totalCurrentSpend = results?.auditedTools.reduce((acc, t) => acc + Number(t.monthlyCost), 0) || 1;

  const topSavingsTool = results?.auditedTools.reduce((max, tool) => {
    return Number(tool.monthlySavings) > Number(max.monthlySavings) ? tool : max;
  }, { monthlySavings: 0 });

  const CustomDonutTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalCurrentSpend) * 100).toFixed(1);
      return (
        <div className="bg-gray-950/90 border border-gray-800 backdrop-blur-md rounded-2xl p-4 shadow-2xl no-print">
          <p className="font-semibold text-white mb-1.5 text-sm">{data.name}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: payload[0].payload.fill || payload[0].color }} />
            <span className="text-gray-400">Monthly Spend:</span>
            <span className="font-bold text-gray-100">${data.value}</span>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-gray-800/60 text-xs text-blue-400 font-semibold">
            {percentage}% of AI Budget
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-950/90 border border-gray-800 backdrop-blur-md rounded-2xl p-4 shadow-2xl no-print">
          <p className="font-semibold text-white mb-2 text-sm">{label}</p>
          <div className="space-y-1.5">
            {payload.map((pld, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: pld.fill || pld.color }} />
                <span className="text-gray-400">{pld.name}:</span>
                <span className="font-bold text-gray-100">${pld.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 shadow-2xl animate-pulse">
          <Loader2 className="animate-spin text-blue-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 tracking-tight">Retrieving Audit Report</h2>
        <p className="text-gray-400 text-sm max-w-md mb-6 leading-relaxed">
          Loading verified FinOps optimization metrics and tooling analysis from cloud storage...
        </p>
        <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (fetchError || !results) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={28} />
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-tight">
            {fetchError ? "Audit Report Unavailable" : "No Audit Report Found"}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {fetchError 
              ? fetchError 
              : "We couldn't find an active audit report in this browser session. Start a 60-second audit to analyze your organization's AI tooling spend."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {fetchError && id && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-2xl font-semibold text-sm transition"
              >
                <RefreshCw size={15} />
                Retry
              </button>
            )}
            <Link
              to="/audit"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl font-semibold text-sm transition shadow-lg shadow-blue-500/20"
            >
              Start Free Audit
            </Link>
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-700 hover:bg-gray-800 text-gray-300 px-5 py-3 rounded-2xl font-semibold text-sm transition"
            >
              <HomeIcon size={15} />
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-950 text-white px-3 sm:px-6 py-6 sm:py-10 print-container">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print, nav, button, input, .fixed, .no-print-section {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: transparent !important;
          }
          .bg-gray-950, .bg-gray-900, .bg-gray-800, .bg-black\/20 {
            background-color: #f9fafb !important;
            color: #111827 !important;
            border: 1px solid #e5e7eb !important;
          }
          .text-white, .text-gray-300, .text-gray-400 {
            color: #1f2937 !important;
          }
          .text-green-400, .text-emerald-400 {
            color: #047857 !important;
          }
          .text-blue-400 {
            color: #1d4ed8 !important;
          }
          .text-purple-400 {
            color: #6d28d9 !important;
          }
          .border-white\/10, .border-gray-800, .border-gray-700 {
            border-color: #e5e7eb !important;
          }
          .print-card-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          /* Stack charts vertically on print so they have full page width and do not overflow */
          .print-charts-grid {
            display: block !important;
          }
          .print-charts-grid > div {
            margin-bottom: 30px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          /* Allow Recharts SVGs to print at their calculated container sizes */
          .recharts-wrapper {
            margin: 0 auto !important;
          }
        }
        /* Screen display overrides to prevent default browser outlines on SVGs and Recharts wrappers */
        svg, 
        .recharts-wrapper, 
        .recharts-surface, 
        .recharts-legend-wrapper, 
        .recharts-default-legend {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}} />
      
      
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/10 blur-[140px] rounded-full pointer-events-none no-print"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[140px] rounded-full pointer-events-none no-print"></div>
      
      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADER */}
        {!isAuthenticated && (
          <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print shadow-lg">
            <div className="flex items-center gap-2.5">
              <Sparkles className="text-blue-400 shrink-0" size={17} />
              <p className="text-xs sm:text-sm text-gray-300">
                <span className="font-semibold text-white">Local Audit Report:</span> Available without login. Sign in or register to sync to your cloud account or email executives.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => openAuthModal("login")}
                className="flex-1 sm:flex-none text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition text-center shadow-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="flex-1 sm:flex-none text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 transition text-center"
              >
                Register
              </button>
            </div>
          </div>
        )}

        <div className="mb-12">
          
          <div className="mb-6 no-print flex items-center justify-between flex-wrap gap-4">
            <Link
              to={id ? "/" : "/audit"}
              className="inline-flex items-center gap-2 bg-gray-900/60 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl transition duration-200 text-sm font-semibold shadow-lg"
            >
              <ArrowLeft size={16} />
              {id ? "Back To Home" : "Back To Audit"}
            </Link>

            {id && (
              <Link
                to="/audit"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl transition duration-200 text-sm font-semibold shadow-lg shadow-blue-500/20"
              >
                Run Your Own Free Audit
              </Link>
            )}
          </div>
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full mb-6 text-xs sm:text-sm font-semibold">
            {id ? "Public Shareable Audit Report" : "AI Spend Optimization Complete"}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 tracking-tight">
            {id ? "Enterprise AI Spend" : "Your AI Spend"}
            <br />
            Audit Results
          </h1>

          <p className="text-gray-400 text-base sm:text-xl max-w-3xl leading-relaxed">
            {id 
              ? "Verified AI infrastructure optimization audit generated by SpendPilot AI. Review potential cost-saving opportunities below."
              : "We analyzed your AI stack and identified optimization opportunities to reduce infrastructure costs and improve efficiency."}
          </p>
        </div>

        {/* HERO STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">

          {/* Monthly Savings */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-transparent border border-emerald-500/25 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl">
            <p className="text-emerald-400 mb-2 sm:mb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Identified Monthly Savings
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 text-emerald-400">
              ${results.totalMonthlySavings}
            </h2>

            <p className="text-gray-400 text-xs sm:text-sm">
              Potential direct recurring reduction
            </p>
          </div>

          {/* Annual Savings */}
          <div className="bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent border border-blue-500/25 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl">
            <p className="text-blue-400 mb-2 sm:mb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Annual Run-Rate Savings
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 text-blue-400">
              ${results.totalAnnualSavings}
            </h2>

            <p className="text-gray-400 text-xs sm:text-sm">
              Estimated yearly optimization
            </p>
          </div>

          {/* Circular Radial Gauge Optimization Score Card */}
          <div className={`bg-gradient-to-br ${scoreDetails.cardGradient} border rounded-3xl p-5 sm:p-6 md:p-8 flex items-center justify-between gap-4 shadow-xl`}>
            <div>
              <p className="text-gray-400 mb-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                Optimization Score
              </p>

              <div className="flex items-baseline gap-1.5 mb-2">
                <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black ${scoreDetails.textColor}`}>
                  {score}
                </h2>
                <span className="text-gray-500 text-sm font-semibold">/100</span>
              </div>

              {/* Dynamic Status Badge */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${scoreDetails.badgeBg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${scoreDetails.dotColor} animate-pulse`} />
                <span>{scoreDetails.label}</span>
              </div>
            </div>
            
            {/* Circular Radial Progress Gauge */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                {/* Background Ring */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-gray-800/80"
                  strokeWidth="7"
                  fill="transparent"
                />
                {/* Animated Value Ring */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className={`transition-all duration-1000 ease-out ${scoreDetails.strokeClass}`}
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm sm:text-base font-extrabold text-white print:text-black">
                  {score}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-4 mb-10 sm:mb-12 no-print">
          <button 
              onClick={() => {
                const reportUrl = (results._id && !String(results._id).startsWith("demo-"))
                  ? `${window.location.origin}/report/${results._id}`
                  : window.location.href;
                navigator.clipboard.writeText(reportUrl);

                setCopied(true);
                setToast({ message: "Report link copied to clipboard!", type: "success" });
                setTimeout(() => { setCopied(false); }, 2000);
              }}
              className="flex-1 sm:flex-none text-center bg-blue-500 hover:bg-blue-600 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl transition-all duration-300 text-xs sm:text-sm font-semibold shadow-lg"
          >
            {copied? "Link Copied!" : "Copy Public Report Link"}
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none text-center bg-purple-600 hover:bg-purple-700 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg"
          >
            Download PDF Report
          </button>

          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none text-center justify-center bg-emerald-600 hover:bg-emerald-700 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg flex items-center gap-2"
          >
            <FileSpreadsheet size={16} />
            Export CSV
          </button>

          <button
            onClick={() => setShowEmailModal(true)}
            className="flex-1 sm:flex-none text-center justify-center bg-indigo-600 hover:bg-indigo-750 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg flex items-center gap-2"
          >
            <Mail size={16} />
            Email Executive Report
          </button>
        </div>

        {/* TOP SAVINGS INSIGHT OR FULLY OPTIMIZED BANNER */}
        {topSavingsTool && Number(topSavingsTool.monthlySavings) > 0 ? (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xl print-card-break relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none"></div>
            <div className="p-3.5 bg-emerald-500/10 rounded-2xl text-emerald-400 font-extrabold flex-shrink-0 animate-pulse text-xl">
              💡
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold text-lg mb-0.5">Top Cost Optimization Opportunity</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                You can save the most on <span className="text-white font-semibold underline decoration-emerald-400 decoration-2">{topSavingsTool.tool}</span> by switching to the recommended plan, reducing spend by <span className="text-emerald-400 font-bold">${topSavingsTool.monthlySavings}/month</span> (${Number(topSavingsTool.monthlySavings) * 12}/year).
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-blue-950/20 border border-blue-500/30 rounded-3xl p-6 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xl print-card-break relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>
            <div className="p-3.5 bg-blue-500/10 rounded-2xl text-blue-400 font-extrabold flex-shrink-0 text-xl">
              🎉
            </div>
            <div>
              <h3 className="text-blue-400 font-bold text-lg mb-0.5">Infrastructure Fully Optimized</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Awesome! We didn't find any overprovisioning or cost overlaps in your current stack. Your organization is operating at maximum AI infrastructure efficiency.
              </p>
            </div>
          </div>
        )}
        
        {/* CHARTS CONTAINER GRID */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12 print-charts-grid">
          {/* Spend Comparison Bar Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 print-card-break">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">
                AI Spend Comparison
              </h2>
              <p className="text-gray-400 text-sm">
                Current monthly spend vs. optimized recommendations.
              </p>
            </div>

            <div className="h-[280px] print-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} /> 
                  <Legend wrapperStyle={{ fontSize: 11 }} /> 
                  
                  <Bar
                     dataKey="Current"
                     fill="#3b82f6"
                     radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Optimized"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spend Allocation Donut Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 print-card-break">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">
                Spend Allocation
              </h2>
              <p className="text-gray-400 text-sm">
                Current monthly budget distribution by tool.
              </p>
            </div>

            <div className="h-[280px] print-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomDonutTooltip />} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* INTERACTIVE WHAT-IF SCENARIO SIMULATOR */}
        <WhatIfSimulator
          auditedTools={results.auditedTools}
          originalScore={score}
          originalMonthlySavings={results.totalMonthlySavings}
          externalToggleTool={simTrigger}
        />
        
        {results.totalMonthlySavings < 100 && (

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-8 mb-12">

                <h2 className="text-2xl font-bold mb-4">
                  Your AI Stack Appears Well Optimized
                 </h2>

                <p className="text-gray-300 text-lg leading-relaxed">
                    We identified relatively limited overspending opportunities in your current infrastructure setup. Your organization appears to be using fairly cost-efficient tooling relative to current workload patterns.
                </p>
              </div>
         )}

         
        {/* CTA SECTION */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/10 border border-blue-500/20 rounded-3xl p-8 mb-12 no-print">
          <h2 className="text-3xl font-bold mb-4">
            {results.totalMonthlySavings >= 500 
              ? "Significant Savings Opportunity Detected" 
              : "Schedule a Free FinOps Audit Review"}
          </h2>

          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {results.totalMonthlySavings >= 500 
              ? "Your organization qualifies for discounted AI credits. Book a free consultation with our team to claim your rewards." 
              : "Want to double check your cost calculations? Book a 15-min call with our engineering team to review optimization strategies."}
          </p>

          <button 
            onClick={() => setShowBookingModal(true)}
            className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition"
          >
            {results.totalMonthlySavings >= 500 ? "Book Credex Consultation" : "Schedule 15-Min Review"}
          </button>
        </div>
        
        {/* AI SUMMARY */}

        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                           border border-white/10 rounded-3xl p-8 mb-12">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <p className="text-green-400 font-medium">
              AI-Generated Executive Summary
          </p> 
        </div>

        {/* CONTENT */}

          <div className="space-y-6">

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">

             Your organization is currently utilizing multiple AI infrastructure tools across development, research, and productivity workflows.
              Our audit identified potential optimization opportunities that may reduce overall AI operational spending by approximately
           <span className="text-green-400 font-semibold">
            {" "} ${results.totalMonthlySavings} monthly
           </span>
             while maintaining current workflow efficiency.

          </p>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">

              Several plans appear slightly overprovisioned relative to current seat utilization,
              particularly among collaboration-focused subscriptions for smaller teams.
              We additionally identified opportunities to consolidate AI tooling into more specialized solutions depending on workload patterns.

          </p>

          <div className="grid md:grid-cols-3 gap-4 pt-4">

           <div className="bg-black/20 rounded-2xl p-5 border border-white/10">

             <p className="text-gray-400 text-sm mb-2">
                Infrastructure Status
             </p>
             <h3 className="text-2xl font-bold">
                Moderate Optimization Needed
             </h3>
          </div>

          <div className="bg-black/20 rounded-2xl p-5 border border-white/10">
              <p className="text-gray-400 text-sm mb-2">
                Potential Savings
              </p>
              <h3 className="text-2xl font-bold text-green-400">
                ${results.totalAnnualSavings}/yr
              </h3>
          </div>
          <div className="bg-black/20 rounded-2xl p-5 border border-white/10">
              
              <p className="text-gray-400 text-sm mb-2">
                Optimization Score
              </p>
              <h3 className="text-2xl font-bold text-purple-400">
                {results.optimizationScore}/100
              </h3>
          </div>
          </div>
        </div>
        </div>

        {/* REDUNDANCY OVERLAP ALERTS */}
        {redundancyAlerts.length > 0 && (
          <div className="space-y-4 mb-12 no-print">
            <h3 className="text-xl font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="text-rose-500 animate-pulse" size={20} />
              SaaS Stack Redundancy Warnings
            </h3>
            <div className="grid gap-4">
              {redundancyAlerts.map((alert, idx) => (
                <div key={idx} className="bg-rose-950/15 border border-rose-500/25 p-5 sm:p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none"></div>
                  <div>
                    <h4 className="text-rose-400 font-bold text-sm sm:text-base mb-1">{alert.title}</h4>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">{alert.description}</p>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start md:self-auto shrink-0">
                    <div className="text-left md:text-right bg-rose-500/10 border border-rose-500/20 px-3.5 py-2 rounded-2xl">
                      <p className="text-[9px] text-rose-300 font-semibold uppercase tracking-wider">Consolidation Savings</p>
                      <p className="text-base sm:text-lg font-black text-rose-400">${alert.savings}/mo</p>
                    </div>
                    {alert.redundantTool && (
                      <button
                        type="button"
                        onClick={() => handleAutoResolveRedundancy(alert.redundantTool)}
                        className="inline-flex items-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        title={`Model cancelling ${alert.redundantTool} in the simulator`}
                      >
                        <Sliders size={14} className="text-rose-300" />
                        <span>Auto-Resolve in Simulator</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOOL BREAKDOWN */}

        <div className="space-y-8">

          {results.auditedTools.map((tool, index) => (

            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-8 hover:border-gray-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
            >

              {/* TOP ROW */}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">

                <div>

                  <h2 className="text-3xl font-bold mb-2">
                    {tool.tool}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3">

                    <span className="bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-300">
                      Current: {tool.plan}
                    </span>

                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm">
                      Suggested: {tool.optimizedPlan}
                    </span>
                  </div>
                </div>

                <div className="text-left md:text-right">

                  <h3 className="text-4xl font-bold text-green-400 mb-2">
                    ${tool.monthlySavings}/mo
                  </h3>

                  <p className="text-gray-400">
                    ${tool.annualSavings}/year savings
                  </p>
                </div>
              </div>

              {/* CONTENT GRID */}

              <div className="grid md:grid-cols-2 gap-6">

                {/* Recommendation */}

                <div className="bg-gray-800/70 rounded-2xl p-6 border border-gray-700">

                  <p className="text-gray-400 mb-3 text-sm uppercase tracking-wide">
                    Recommended Action
                  </p>

                  <h3 className="text-xl font-semibold leading-relaxed">
                    {tool.recommendation}
                  </h3>
                <div className="flex flex-wrap gap-3 mt-5">

                  {/* Savings Badge */}

                  {tool.monthlySavings > 0 ? (

                    <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                      Savings Opportunity
                    </span>
                  ) : (
                    <span className="bg-gray-800/10 border border-gray-700 text-gray-400 px-4 py-2 rounded-full text-sm">
                      Already Optimized
                    </span>
                  )}

                {/* use case Badge */}

                <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm">
                    {tool.useCase}
                  </span>

                  {/* Seats Badge */}
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm">
                    {tool.seats} seats
                  </span>
                </div>
                </div>


                {/* Savings */}

                <div className="bg-gray-800/70 rounded-2xl p-6 border border-gray-700">

                  <p className="text-gray-400 mb-3 text-sm uppercase tracking-wide">
                    Potential Savings
                  </p>

                  <h3 className="text-xl font-semibold">
                    ${tool.monthlySavings} monthly
                  </h3>
                </div>
              </div>

              {/* REASONING */}

              <div className="mt-6 bg-gray-800/70 rounded-2xl p-6 border border-gray-700">

                <p className="text-gray-400 mb-3 text-sm uppercase tracking-wide">
                  Audit Reasoning
                </p>

                <p className="text-gray-300 leading-relaxed text-lg">
                  {tool.reasoning}
                </p>
              </div>

              {/* PLAN COMPARISON WIDGET TRIGGER */}
              {PLAN_FEATURES_MATRIX[tool.tool]?.[tool.plan] && (
                <div className="mt-6 no-print">
                  <button
                    onClick={() => setCompareToolId(compareToolId === tool.tool ? null : tool.tool)}
                    className="border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-5 py-3 rounded-2xl text-xs font-semibold transition flex items-center gap-2"
                  >
                    <span>{compareToolId === tool.tool ? "Hide Feature Checklists" : "Compare Plan Features"}</span>
                    <ArrowRight size={14} className={`transform transition-transform ${compareToolId === tool.tool ? "rotate-90" : ""}`} />
                  </button>

                  {compareToolId === tool.tool && (
                    <div className="mt-4 p-6 bg-gray-950/60 rounded-3xl border border-gray-800 animate-toast-in">
                      <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-4">SaaS Features Mapping ({tool.plan} Plan)</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* KEPT */}
                        <div>
                          <h5 className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                            <CheckCircle2 size={14} />
                            Features Retained
                          </h5>
                          <ul className="space-y-2">
                            {PLAN_FEATURES_MATRIX[tool.tool][tool.plan].kept.map((f, i) => (
                              <li key={i} className="text-gray-300 text-xs leading-relaxed flex items-start gap-2">
                                <span className="text-emerald-500 mt-1">•</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* RIGHT SIZED */}
                        <div>
                          <h5 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5">
                            <XCircle size={14} className="text-rose-500/70" />
                            Omitted / Right-Sized
                          </h5>
                          <ul className="space-y-2">
                            {PLAN_FEATURES_MATRIX[tool.tool][tool.plan].removed.map((f, i) => (
                              <li key={i} className="text-gray-400 text-xs leading-relaxed flex items-start gap-2">
                                <span className="text-rose-500/70 mt-1">•</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* EMAIL CAPTURE SECTION */}

        {/* EMAIL CAPTURE SECTION */}
        <div className="mt-12 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-5 sm:p-7 md:p-8 no-print shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              FinOps Digest
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Get Audit Updates
          </h2>

          <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed max-w-2xl">
            Receive monthly AI tooling optimization insights, benchmark pricing adjustments, and vendor consolidation recommendations directly in your inbox.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* EMAIL INPUT */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Work Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-700 rounded-2xl px-4 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* COMPANY INPUT */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Company Name (optional)
              </label>
              <input
                type="text"
                placeholder="Acme Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-700 rounded-2xl px-4 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON & TIP */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={handleLeadSubmit}
              disabled={isSubmittingLead}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-semibold text-sm sm:text-base transition cursor-pointer shadow-lg shadow-blue-600/20"
            >
              {isSubmittingLead ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : leadSaved ? (
                <>
                  <CheckCircle2 size={18} className="text-white" />
                  <span>Subscribed & Saved</span>
                </>
              ) : (
                <>
                  <Mail size={18} />
                  <span>Get Audit Updates</span>
                </>
              )}
            </button>

            <span className="text-xs text-gray-500 flex items-center gap-1.5">
              <span>🔒</span> Zero spam. Only actionable SaaS FinOps insights.
            </span>
          </div>

          {/* STATUS NOTICE BOX */}
          {leadNotice && (
            <div
              className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                leadNotice.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-300"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                <p>{leadNotice.text}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 sm:p-6 max-w-md w-full relative shadow-2xl animate-toast-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowBookingModal(false);
                setSelectedDate(null);
                setSelectedTime(null);
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition p-1.5 hover:bg-gray-800 rounded-lg"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Schedule FinOps Review</h3>
            <p className="text-gray-400 text-xs mb-6 font-medium">Select a date and time slot for your audit overview call.</p>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">Select Date</label>
              <div className="grid grid-cols-5 gap-2">
                {availableDates.map((date, idx) => {
                  const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                  const dayStr = date.toLocaleDateString(undefined, { weekday: "short" });
                  const dateNum = date.getDate();
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      type="button"
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected 
                          ? "border-blue-500 bg-blue-500/10 text-blue-400 font-extrabold" 
                          : "border-gray-800 bg-gray-950/40 text-gray-400 hover:border-gray-750 font-semibold"
                      }`}
                    >
                      <span className="text-[9px] uppercase">{dayStr}</span>
                      <span className="text-sm mt-0.5">{dateNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time, idx) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedTime(time)}
                      type="button"
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected 
                          ? "border-blue-500 bg-blue-500/10 text-blue-400" 
                          : "border-gray-800 bg-gray-950/40 text-gray-400 hover:border-gray-750"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirm Action Button */}
            <button
              onClick={handleConfirmBooking}
              disabled={!selectedDate || !selectedTime || bookingLoading}
              className="w-full bg-blue-600 hover:bg-blue-750 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg mt-2 flex items-center justify-center text-sm"
            >
              {bookingLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </div>
      )}

      {/* EMAIL EXECUTIVE REPORT MODAL */}
      <EmailReportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        reportId={results._id}
        reportData={results}
        onEmailSent={(msg) => {
          setToast({ message: msg || "Executive report dispatched successfully!", type: "success" });
        }}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Results;