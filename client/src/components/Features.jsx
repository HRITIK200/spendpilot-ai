import { DollarSign, BarChart3, Sparkles } from "lucide-react";

function Features() {
  const features = [
    {
      icon: <DollarSign size={32} />,
      title: "Cost Optimization",
      desc: "Detect unnecessary subscriptions and expensive plans instantly."
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Smart Benchmarking",
      desc: "Compare your AI spend against companies of similar size."
    },
    {
      icon: <Sparkles size={32} />,
      title: "AI-Powered Insights",
      desc: "Receive personalized optimization recommendations automatically."
    }
  ];

  return (
    <section
      id="features"
      className="py-32 px-6"
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold">
            Built For Modern AI Teams
          </h2>

          <p className="text-gray-400 mt-6 text-xl">
            Everything you need to understand and reduce AI infrastructure costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition"
            >
              <div className="mb-6 text-white">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Features;