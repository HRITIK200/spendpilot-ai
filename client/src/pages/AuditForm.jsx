import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toolData } from "../data/toolData";
import { saveReport } from "../api/reportApi";
import Tooltip from "../components/Tooltip";
import Navbar from "../components/Navbar";
import { Lock, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AuditForm = () => {

  useEffect(() => {
  document.title =
    "AI Audit Form | SpendPilot AI";
   }, []);

  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [tools, setTools] = useState(() => {
  const savedTools = localStorage.getItem("auditTools");
  

  return savedTools
    ? JSON.parse(savedTools)
    : [
        {
          id: 1,
          tool: "",
          plan: "",
          monthlyCost: "",
          seats: 1,
          useCase: "",
        },
      ];
   });

   useEffect(() => {
    localStorage.setItem("auditTools", JSON.stringify(tools));
   }, [tools]);

  const addTool = () => {
    setTools([
      ...tools,
      {
        id: Date.now(),
        tool: "",
        plan: "",
        monthlyCost: "",
        seats: 1,
        useCase: "",
      },
    ]);
  };

  const removeTool = (id) => {
    setTools(tools.filter((tool) => tool.id !== id));
    // Remove errors for this row if any exist
    if (errors[id]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    tools.forEach((t) => {
      const toolErrors = {};
      if (!t.tool) {
        toolErrors.tool = "AI Tool is required";
        isValid = false;
      }
      if (!t.plan) {
        toolErrors.plan = "Plan is required";
        isValid = false;
      }
      if (!t.seats || Number(t.seats) <= 0) {
        toolErrors.seats = "Seats must be greater than 0";
        isValid = false;
      }
      if (!t.useCase) {
        toolErrors.useCase = "Use case is required";
        isValid = false;
      }

      if (Object.keys(toolErrors).length > 0) {
        newErrors[t.id] = toolErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (id, field, value) => {

    const updatedTools = tools.map((tool) => {

      //keep other tools unchanged
      if (tool.id !== id) return tool;
      
      //update the current tool
      const updatedTool = { ...tool, [field]: value };

      //reset plan when tool changes
      if(field === "tool") {
        updatedTool.plan = "";
        updatedTool.monthlyCost = "";
      }
      
      //auto-fill pricing
      if (field === "plan") {

        const selectedTool = toolData.find(
          (item) => item.tool === updatedTool.tool
        );

        const selectedPlan = selectedTool?.plans.find(
          (plan) => plan.name === value
        );

        if (selectedPlan) {
          updatedTool.monthlyCost = 
             selectedPlan.monthlyPrice;
        }
      }
      return updatedTool;
    });

    setTools(updatedTools);

    // Clear dynamic error for this field
    if (errors[id]?.[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        if (updated[id]) {
          delete updated[id][field];
          if (Object.keys(updated[id]).length === 0) {
            delete updated[id];
          }
        }
        return updated;
      });
    }
  };

  const getToolBorderClass = (toolName) => {
    switch (toolName) {
      case "ChatGPT":
        return "border-t-4 border-t-emerald-500 border-x-gray-800 border-b-gray-800";
      case "Claude":
        return "border-t-4 border-t-orange-500 border-x-gray-800 border-b-gray-800";
      case "Cursor":
        return "border-t-4 border-t-blue-500 border-x-gray-800 border-b-gray-800";
      case "GitHub Copilot":
        return "border-t-4 border-t-slate-500 border-x-gray-800 border-b-gray-800";
      case "Gemini":
        return "border-t-4 border-t-indigo-500 border-x-gray-800 border-b-gray-800";
      case "OpenAI API":
        return "border-t-4 border-t-teal-500 border-x-gray-800 border-b-gray-800";
      case "Anthropic API":
        return "border-t-4 border-t-amber-600 border-x-gray-800 border-b-gray-800";
      case "Windsurf":
        return "border-t-4 border-t-cyan-500 border-x-gray-800 border-b-gray-800";
      default:
        return "border-gray-800";
    }
  };

  const handleGenerateReport = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Save report to MongoDB (server will run the Gemini API optimization engine or fallback rules)
      const savedReport = await saveReport({ tools });

      // Save locally for quick access
      localStorage.setItem("auditResults", JSON.stringify(savedReport));

      // Append to past audits history (accessible in History drawer without login)
      const existingHistory = JSON.parse(localStorage.getItem("spendpilot_history") || "[]");
      const newHistory = [savedReport, ...existingHistory.filter((h) => h._id !== savedReport._id)].slice(0, 15);
      localStorage.setItem("spendpilot_history", JSON.stringify(newHistory));

      // Navigate to results page
      navigate("/results");

    } catch (error) {
      console.log("Error generating report:", error);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-white px-3 sm:px-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-tight">
          AI Tool Audit Form
        </h1>

        <p className="text-gray-400 mb-6 text-xs sm:text-base">
          Add all AI tools your company currently uses.
        </p>

        {!isAuthenticated && (
          <div className="mb-8 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-blue-950/30 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xl">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles size={17} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Guest Audit Mode Active</h3>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                  Audits work instantly without login and save to your browser's History. Sign in to sync across devices.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex-1 sm:flex-none text-xs font-semibold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition text-center shadow-lg shadow-blue-500/20"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className="flex-1 sm:flex-none text-xs font-semibold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 transition text-center"
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* Tool Cards */}
        <div className="space-y-6">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              className={`bg-gray-900 border ${getToolBorderClass(tool.tool)} rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Tool #{index + 1}
                </h2>

                {tools.length > 1 && (
                  <button
                    onClick={() => removeTool(tool.id)}
                    className="bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Inputs */}
              <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                
              {/* Tool Selection */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm text-gray-300 font-medium">
                    Select AI Tool
                    <Tooltip content="Select the specific generative AI tool you are currently billing." />
                  </label>

                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 p-2 sm:p-3 bg-gray-950/40 rounded-2xl border ${
                    errors[tool.id]?.tool ? "border-red-500/50" : "border-gray-800"
                  }`}>
                    {toolData.map((t) => {
                      const isSelected = tool.tool === t.tool;
                      const brandStyles = {
                        "ChatGPT": "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
                        "Claude": "border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20",
                        "Cursor": "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
                        "GitHub Copilot": "border-slate-500/30 bg-slate-500/10 text-slate-200 hover:bg-slate-500/20",
                        "Gemini": "border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20",
                        "OpenAI API": "border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20",
                        "Anthropic API": "border-amber-600/30 bg-amber-600/10 text-amber-500 hover:bg-amber-600/20",
                        "Windsurf": "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                      };

                      const activeStyle = brandStyles[t.tool] || "border-blue-500 bg-blue-500/10 text-white";

                      return (
                        <button
                          key={t.tool}
                          type="button"
                          onClick={() => handleChange(tool.id, "tool", t.tool)}
                          className={`px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-xl border text-[11px] sm:text-xs font-semibold transition-all duration-200 flex items-center justify-start gap-2 hover:scale-[1.02] active:scale-[0.98] ${
                            isSelected
                              ? `${activeStyle} border-2 shadow-lg`
                              : "border-gray-800 bg-gray-800/20 text-gray-400 hover:border-gray-700 hover:text-gray-300"
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            t.tool === "ChatGPT" ? "bg-emerald-500" :
                            t.tool === "Claude" ? "bg-orange-500" :
                            t.tool === "Cursor" ? "bg-blue-500" :
                            t.tool === "GitHub Copilot" ? "bg-slate-400" :
                            t.tool === "Gemini" ? "bg-indigo-500" :
                            t.tool === "OpenAI API" ? "bg-teal-500" :
                            t.tool === "Anthropic API" ? "bg-amber-500" :
                            "bg-cyan-500"
                          }`} />
                          {t.tool}
                        </button>
                      );
                    })}
                  </div>
                  {errors[tool.id]?.tool && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{errors[tool.id].tool}</p>
                  )}
                </div>

                {/* Plan Selection */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300">
                    Plan
                    <Tooltip content="The plan tier of your subscription. Downgrade recommendations are analyzed based on this value." />
                  </label>

                  <select
                    value={tool.plan}
                    onChange={(e) =>
                      handleChange(tool.id, "plan", e.target.value)
                    }
                    disabled={!tool.tool}
                    className={`w-full bg-gray-800 border ${
                      errors[tool.id]?.plan 
                        ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                        : "border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    } rounded-xl px-4 py-3 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="">Select Plan</option>
                    {toolData
                      .find((t) => t.tool === tool.tool)
                      ?.plans.map((plan) => (
                        <option key={plan.name} value={plan.name}>
                          {plan.name}
                        </option>
                      ))}
                  </select>
                  {errors[tool.id]?.plan && (
                    <p className="text-red-500 text-xs mt-1">{errors[tool.id].plan}</p>
                  )}
                </div>

                {/* Monthly Cost */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300">
                    Monthly Cost ($)
                    <Tooltip content="The standard monthly pricing per seat, pre-filled based on your tool and plan selection." />
                  </label>

                  <input
                    type="number"
                    placeholder="20"
                    value={tool.monthlyCost}
                    readOnly
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none cursor-not-allowed text-gray-400"
                  />
                 </div> 

                {/* Seats */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300">
                    Seats/Users
                    <Tooltip content="The number of active users or license keys. Helps identify over-provisioning and redundancy metrics." />
                  </label>

                  <input
                    type="number"
                    placeholder="10"
                    value={tool.seats}
                    onChange={(e) =>
                      handleChange(tool.id, "seats", e.target.value)
                    }
                    className={`w-full bg-gray-800 border ${
                      errors[tool.id]?.seats 
                        ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                        : "border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    } rounded-xl px-4 py-3 outline-none transition`}
                  />
                  {errors[tool.id]?.seats && (
                    <p className="text-red-500 text-xs mt-1">{errors[tool.id].seats}</p>
                  )}
                 </div>

                  {/* Use Case */}
                  <div>
                    <label className="block mb-2 text-sm text-gray-300">
                       Use Case
                       <Tooltip content="The primary workflow context. Flagging development vs general workflows helps suggest specialized tooling." />
                    </label>
                    
                    <select
                      value={tool.useCase}
                      onChange={(e) =>
                        handleChange(tool.id, "useCase", e.target.value)
                      }
                      className={`w-full bg-gray-800 border ${
                        errors[tool.id]?.useCase 
                          ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                          : "border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      } rounded-xl px-4 py-3 outline-none transition`}
                    >
                      <option value="">Select Use Case</option>

                      <option value="coding">Coding/Development</option>
                      <option value="writing">Writing/Content Creation</option>
                      <option value="research">Research/Data Analysis</option>
                      <option value="mixed">Mixed/Other</option>
                    </select>
                    {errors[tool.id]?.useCase && (
                      <p className="text-red-500 text-xs mt-1">{errors[tool.id].useCase}</p>
                    )}
                  </div>

              </div>
            </div>
          ))}
        </div>

        {/* Add Tool Button */}
        <button
          onClick={addTool}
          className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium transition"
        >
          + Add Another Tool
        </button>

        {/* Submit Button */}
        <div className="mt-10">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base shadow-lg shadow-green-600/20 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {loading ? "Generating Report..." : "Generate Audit Report"}
            </span>
          </button>
          {!isAuthenticated && (
            <p className="text-xs text-gray-500 mt-2.5">
              Available instantly without login · Automatically saved to your local Audit History.
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default AuditForm;