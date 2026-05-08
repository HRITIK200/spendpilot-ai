import { useEffect, useState } from "react";

const Results = () => {

  const [results, setResults] = useState(null);

  useEffect(() => {

    const savedResults =
      localStorage.getItem("auditResults");

    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }

  }, []);

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
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADER */}

        <div className="mb-12">

          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full mb-6">
            AI Spend Optimization Complete
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
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

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-3xl p-8">

            <p className="text-green-400 mb-3 text-sm uppercase tracking-wide">
              Monthly Savings
            </p>

            <h2 className="text-5xl font-bold mb-2">
              ${results.totalMonthlySavings}
            </h2>

            <p className="text-gray-400">
              Estimated monthly optimization
            </p>
          </div>

          {/* Annual Savings */}

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-3xl p-8">

            <p className="text-blue-400 mb-3 text-sm uppercase tracking-wide">
              Annual Savings
            </p>

            <h2 className="text-5xl font-bold mb-2">
              ${results.totalAnnualSavings}
            </h2>

            <p className="text-gray-400">
              Estimated yearly reduction
            </p>
          </div>

          {/* Optimization Score */}

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-3xl p-8">

            <p className="text-purple-400 mb-3 text-sm uppercase tracking-wide">
              Optimization Score
            </p>

            <h2 className="text-5xl font-bold mb-2">
              {results.optimizationScore}/100
            </h2>

            <p className="text-gray-400">
              AI infrastructure efficiency
            </p>
          </div>
        </div>

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

        {/* TOOL BREAKDOWN */}

        <div className="space-y-8">

          {results.auditedTools.map((tool, index) => (

            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-all duration-300"
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
      </div>
    </div>
  );
};

export default Results;