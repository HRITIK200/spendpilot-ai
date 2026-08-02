import { useState } from "react";
import { Link } from "react-router-dom";

function Hero() {
  const [teamSize, setTeamSize] = useState(15);

  // Heuristics:
  // - Average spend per user on AI tools: ~$80/month (e.g. ChatGPT Team + Claude Team + Cursor + Copilot)
  // - SpendPilot AI optimization typically cuts spend by 25% (~$20/user/month)
  const monthlySavings = teamSize * 20;
  const annualSavings = monthlySavings * 12;

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl mx-auto text-center">

        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-2 mb-6">
          <span className="text-sm text-gray-300">
            AI Infrastructure Spend Optimization
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold leading-tight">
          Stop Overspending
          <br />
          On AI Tools
        </h1>

        <p className="text-gray-400 text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
          Audit your ChatGPT, Claude, Cursor, Copilot and API spending instantly.
          Discover savings opportunities in under 60 seconds.
        </p>

        <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
          <Link
            to="/audit"
            className="bg-white text-black px-7 py-4 rounded-2xl font-semibold hover:scale-105 transition"
          >
            Run Free Audit
          </Link>

          <button className="border border-white/10 px-7 py-4 rounded-2xl hover:bg-white/5 transition">
            View Demo
          </button>
        </div>

        {/* ROI Calculator Widget */}
        <div className="max-w-xl mx-auto mt-14 p-6 md:p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl relative group hover:border-white/20 transition-all duration-300">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full text-white uppercase tracking-wider shadow-lg">
            Interactive ROI Calculator
          </div>
          
          <h3 className="text-lg font-semibold mb-6 mt-2 text-gray-200">
            Estimate your team's potential savings
          </h3>

          <div className="flex flex-col gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400 font-medium">Team Size (Seats)</span>
                <span className="text-lg font-bold text-white bg-white/10 px-3 py-1 rounded-xl">
                  {teamSize} seats
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="100"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="text-left bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Monthly Savings
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                  ${monthlySavings.toLocaleString()}
                </p>
              </div>

              <div className="text-left bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Annual Savings
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-blue-400">
                  ${annualSavings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition duration-300">
            <h3 className="text-4xl font-bold text-blue-400">${annualSavings.toLocaleString()}</h3>
            <p className="text-gray-400 mt-2">Your team's annual savings</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-4xl font-bold">60 sec</h3>
            <p className="text-gray-400 mt-2">Average audit completion</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-4xl font-bold">8+</h3>
            <p className="text-gray-400 mt-2">AI tools supported</p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;