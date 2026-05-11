import { useEffect, useState } from "react";
import { saveLead } from "../api/leadApi";

import { Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Results = () => {

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);

  const handleLeadSubmit = async () => {

    try {

      await saveLead({
        email,
        company,
      });

      setLeadSaved(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
  document.title =
    "Audit Results | SpendPilot AI";
   }, []);

  const [results] = useState(() => {
    const savedResults = localStorage.getItem("auditResults");
    return savedResults ? JSON.parse(savedResults) : null;
  });


  const [copied, setCopied] = useState(false);

  const chartData = 
  results?.auditedTools.map((tool) => ({
      name: tool.tool,

      Current: Number(tool.monthlyCost),

      Optimized: 
         Number(tool.monthlyCost) - 
         Number(tool.monthlySavings),
    })) || [];

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <h1 className="text-2xl">
          No audit results found.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-6 py-8 md:py-10">
      
      
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/10 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[140px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADER */}

        <div className="mb-12">
          
          <div className="flex justify-end">
            <button
              onClick={() => window.history.back()}
              className=" bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-2xl transition"
               >
               ← Back To Audit
             </button>
          </div>
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full mb-6">
            AI Spend Optimization Complete
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Your AI Spend
            <br />
            Audit Results
          </h1>

          <p className="text-gray-400 text-xl max-w-3xl leading-relaxed">
            We analyzed your AI stack and identified optimization opportunities to reduce infrastructure costs and improve efficiency.
          </p>
        </div>

        {/* HERO STATS */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          {/* Monthly Savings */}

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-3xl p-6 md:p-8">

            <p className="text-green-400 mb-3 text-sm uppercase tracking-wide">
              Monthly Savings
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              ${results.totalMonthlySavings}
            </h2>

            <p className="text-gray-400">
              Estimated monthly optimization
            </p>
          </div>

          {/* Annual Savings */}

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-3xl p-6 md:p-8">

            <p className="text-blue-400 mb-3 text-sm uppercase tracking-wide">
              Annual Savings
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              ${results.totalAnnualSavings}
            </h2>

            <p className="text-gray-400">
              Estimated yearly reduction
            </p>
          </div>

          {/* Optimization Score */}

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-3xl p-6 md:p-8">

            <p className="text-purple-400 mb-3 text-sm uppercase tracking-wide">
              Optimization Score
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              {results.optimizationScore}/100
            </h2>

            <p className="text-gray-400">
              AI infrastructure efficiency
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">

          <button 
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/report/${results._id}`
                );

                setCopied(true);
                setTimeout(() => { setCopied(false); }, 2000);
              }}
              className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-2xl transition transition transition-all duration-300"
          >
            {copied? "Link Copied!" : "Copy Public Report Link"}
          </button>
          </div>
        
        {/* SPEND COMPARISON CHART */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              AI Spend Comparison
            </h2>

            <p className="text-gray-400 text-lg">
              Current monthly spend vs. optimized recommendations.
            </p>
          </div>

          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip  
                  contentStyle={{
                     backgroundColor: "#111827",
                     border: "1px solid #374151",
                     borderRadius: "12px",
                     color: "#fff",
                    }}
                /> 
                <Legend /> 
                
                <Bar
                   dataKey="Current"
                   fill="#3b82f6"
                   radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="Optimized"
                  fill="#22c55e"
                  radius={[8, 8, 0, 0]}
                />
         
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
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

        {results.totalMonthlySavings >= 500 && (

          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8 mb-12">

            <h2 className="text-3xl font-bold mb-4">
              Significant Savings Opportunity Detected
            </h2>

            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Your organization may benefit from discounted AI infrastructure credits through Credex optimization partnerships.
            </p>

            <button className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition">
              Book Credex Consultation
            </button>
          </div>
        )}
        
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
            </div>
          ))}
        </div>

        {/* EMAIL CAPTURE SECTION */}

         <div className="mt-12 bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">

          <h2 className="text-3xl font-bold mb-3">
            Get Audit Updates
          </h2>

          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            Receive future AI tooling optimization insights and infrastructure recommendations directly in your inbox.
          </p>

          <div className="grid md:grid-cols-2 gap-4">

          {/* EMAIL INPUT */}
          <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800/70 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {/* COMPANY INPUT */}
          <input
              type="text"
              placeholder="Company name (optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-gray-800/70 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          </div>
          {/* BUTTON */}
          <button
              onClick={handleLeadSubmit}
              className="mt-4 bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-2xl font-semibold transition"
          >
            {leadSaved ? "Saved Successfully.. Thank you!" : "Get updates"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;