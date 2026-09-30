import { DollarSign, BarChart3, Sparkles, SlidersHorizontal, CheckCircle2, ShieldCheck } from "lucide-react";

function Features() {
  const features = [
    {
      step: "01",
      icon: <DollarSign size={26} className="text-emerald-400" />,
      badge: "Plan Right-Sizing",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      title: "Cost Optimization Engine",
      desc: "Detect overprovisioned seats, underutilized enterprise subscriptions, and expensive team plans in under 60 seconds.",
      bullets: ["Right-sizes ChatGPT, Claude, and IDE seats", "Decommissions ghost licenses", "Immediate ROI modeling"],
    },
    {
      step: "02",
      icon: <SlidersHorizontal size={26} className="text-blue-400" />,
      badge: "What-If Modeling",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      title: "Interactive Scenario Simulator",
      desc: "Model dynamic team expansions or contraction scenarios with real-time seat sliders, plan toggles, and live score re-weighting.",
      bullets: ["Live seat & tier adjustments", "Redundancy overlap elimination", "Instant budget reforecasting"],
    },
    {
      step: "03",
      icon: <BarChart3 size={26} className="text-purple-400" />,
      badge: "Executive Reporting",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      title: "Automated FinOps Reports",
      desc: "Generate board-ready public reports, downloadable audit summaries, and automated executive email delivery for CFO reviews.",
      bullets: ["Shareable tokenized URLs", "Transactional executive email dispatch", "Cloud-synced audit history"],
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 border border-purple-500/20 bg-purple-500/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-purple-300 uppercase tracking-wider mb-4">
            <Sparkles size={14} className="text-purple-400" />
            FinOps Intelligence Platform
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built For Modern Engineering & Finance Teams
          </h2>
          <p className="text-gray-400 mt-4 text-base sm:text-lg leading-relaxed">
            Everything your company needs to audit, understand, and reduce AI SaaS infrastructure spending.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-3xl p-6 sm:p-8 transition duration-300 relative group flex flex-col justify-between hover:-translate-y-1 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                  {feature.desc}
                </p>
              </div>

              <div className="pt-5 border-t border-white/5 space-y-2.5">
                {feature.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;