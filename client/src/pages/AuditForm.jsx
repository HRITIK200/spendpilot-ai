import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toolData } from "../data/toolData";
import { generateAudit } from "../utils/auditEngine";
import { saveReport } from "../api/reportApi";


const AuditForm = () => {

  useEffect(() => {
  document.title =
    "AI Audit Form | SpendPilot AI";
   }, []);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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
  };

  const handleGenerateReport = async () => {
    
    setLoading(true);
    
    try {

      //generate audit analysis
      const auditResults = generateAudit(tools);

      //save report to MongoDB
      const savedReport = await saveReport(auditResults);

      //save locally for quick access
      localStorage.setItem("auditResults", JSON.stringify(savedReport));

      //navigate to results page
      navigate("/results");

    } catch (error) {

      console.log("Error generating report:", error);
      alert("Failed to generate report");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-2">
          AI Tool Audit Form
        </h1>

        <p className="text-gray-400 mb-10">
          Add all AI tools your company currently uses.
        </p>

        {/* Tool Cards */}
        <div className="space-y-6">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold">
                  Tool #{index + 1}
                </h2>

                {tools.length > 1 && (
                  <button
                    onClick={() => removeTool(tool.id)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Inputs */}
              <div className="grid md:grid-cols-2 gap-5">
                
              {/* Tool Selection */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300">
                    AI Tool
                  </label>

                  <select
                    value={tool.tool}
                    onChange={(e) =>
                      handleChange(tool.id, "tool", e.target.value)
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="">Select AI Tool</option>
                    {toolData.map((t) => (
                      <option key={t.tool} value={t.tool}>
                        {t.tool}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plan Selection */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300">
                    Plan
                  </label>

                  <select
                    value={tool.plan}
                    onChange={(e) =>
                      handleChange(tool.id, "plan", e.target.value)
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500">
                    <option value="">Select Plan</option>
                    {toolData
                      .find((t) => t.tool === tool.tool)
                      ?.plans.map((plan) => (
                        <option key={plan.name} value={plan.name}>
                          {plan.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Monthly Cost */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300">
                    Monthly Cost ($)
                  </label>

                  <input
                    type="number"
                    placeholder="20"
                    value={tool.monthlyCost}
                    readOnly
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 cursor-not-allowed"
                  />
                 </div> 

                {/* Seats */}
                <div>
                 <label className="block mb-2 text-sm text-gray-300">
                    Seats/Users
                 </label>

                  <input
                   type="number"
                   placeholder="10"
                   value={tool.seats}
                    onChange={(e) =>
                      handleChange(tool.id, "seats", e.target.value)
                       }
                     className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                         />
                 </div>

                  {/* Use Case */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm text-gray-300">
                       Use Case
                    </label>
                    
                    <select
                      value={tool.useCase}
                      onChange={(e) =>
                        handleChange(tool.id, "useCase", e.target.value)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500">
                      <option value="">Select Use Case</option>

                      <option value="coding">Coding/Development</option>
                      <option value="writing">Writing/Content Creation</option>
                      <option value="research">Research/Data Analysis</option>
                      <option value="mixed">Mixed/Other</option>
                      </select>
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
            onClick={handleGenerateReport} disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
           {loading ? "Generating Report..." : "Generate Audit Report"  }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditForm;