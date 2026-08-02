import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { saveLead } from "../api/leadApi";
import Toast from "../components/Toast";

import { Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Results = () => {

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);
  const [toast, setToast] = useState(null);

  const handleLeadSubmit = async () => {
    if (!email) {
      setToast({ message: "Please enter your email address", type: "error" });
      return;
    }

    try {

      await saveLead({
        email,
        company,
      });

      setLeadSaved(true);
      setToast({ message: "Successfully registered for updates!", type: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "Failed to subscribe. Please try again.", type: "error" });
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


  const [copied, setCopied] = useState(false);

  const score = results?.optimizationScore || 100;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColorClass = (val) => {
    if (val >= 85) return "stroke-emerald-500 text-emerald-400";
    if (val >= 70) return "stroke-yellow-500 text-yellow-400";
    return "stroke-rose-500 text-rose-400";
  };

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
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-6 py-8 md:py-10 print-container">
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
      `}} />
      
      
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/10 blur-[140px] rounded-full pointer-events-none no-print"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[140px] rounded-full pointer-events-none no-print"></div>
      
      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADER */}

        <div className="mb-12">
          
          <div className="mb-6 no-print">
            <Link
              to="/audit"
              className="inline-flex items-center gap-2 bg-gray-900/60 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl transition duration-200 text-sm font-semibold shadow-lg"
            >
              <ArrowLeft size={16} />
              Back To Audit
            </Link>
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

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-3xl p-6 md:p-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-purple-400 mb-3 text-sm uppercase tracking-wide">
                Optimization Score
              </p>

              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                {score}/100
              </h2>

              <p className="text-gray-400">
                AI infrastructure efficiency
              </p>
            </div>
            
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                {/* Background Circle */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-gray-800"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Animated Foreground Circle */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className={`transition-all duration-1000 ease-out ${getScoreColorClass(score)}`}
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-white print:text-black">
                {score}%
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-12 no-print">

          <button 
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/report/${results._id}`
                );

                setCopied(true);
                setToast({ message: "Public report link copied to clipboard!", type: "success" });
                setTimeout(() => { setCopied(false); }, 2000);
              }}
              className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-2xl transition-all duration-300"
          >
            {copied? "Link Copied!" : "Copy Public Report Link"}
          </button>
          
          <button
            onClick={() => window.print()}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-2xl transition-all duration-300 font-semibold"
          >
            Download PDF Report
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
        <div className="grid md:grid-cols-2 gap-8 mb-12 print-charts-grid">
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
                    cy="50%"
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
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
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

         <div className="mt-12 bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 no-print">

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

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-md w-full relative shadow-2xl animate-toast-in">
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