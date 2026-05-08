import { useEffect, useState } from "react";

const AuditForm = () => {
  const [tools, setTools] = useState(() => {
  const savedTools = localStorage.getItem("auditTools");

  return savedTools
    ? JSON.parse(savedTools)
    : [
        {
          id: 1,
          toolName: "",
          category: "",
          monthlyCost: "",
          teamSize: "",
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
        toolName: "",
        category: "",
        monthlyCost: "",
        teamSize: "",
        useCase: "",
      },
    ]);
  };

  const removeTool = (id) => {
    setTools(tools.filter((tool) => tool.id !== id));
  };

  const handleChange = (id, field, value) => {
    setTools(
      tools.map((tool) =>
        tool.id === id ? { ...tool, [field]: value } : tool
      )
    );
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
                
                {/* Tool Name */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300">
                    Tool Name
                  </label>

                  <input
                    type="text"
                    placeholder="ChatGPT"
                    value={tool.toolName}
                    onChange={(e) =>
                      handleChange(tool.id, "toolName", e.target.value)
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block mb-2 text-sm text-gray-300">
                    Category
                  </label>

                  <select
                    value={tool.category}
                    onChange={(e) =>
                      handleChange(tool.id, "category", e.target.value)
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Writing">Writing</option>
                    <option value="Design">Design</option>
                    <option value="Coding">Coding</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Automation">Automation</option>
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
                    onChange={(e) =>
                      handleChange(tool.id, "monthlyCost", e.target.value)
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
                {/* Team Size */}
                <div>
                 <label className="block mb-2 text-sm text-gray-300">
                   Team Size
                 </label>

                  <input
                   type="number"
                   placeholder="10"
                   value={tool.teamSize}
                    onChange={(e) =>
                      handleChange(tool.id, "teamSize", e.target.value)
                       }
                     className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                         />
                 </div>
                  {/* Use Case */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm text-gray-300">
                       Use Case
                    </label>
                    <textarea
                      placeholder="Describe how your team uses this tool..."
                      value={tool.useCase}
                      onChange={(e) =>
                        handleChange(tool.id, "useCase", e.target.value)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 resize-none h-24"
                    />
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
            className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-2xl text-lg font-semibold transition"
          >
            Generate Audit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditForm;