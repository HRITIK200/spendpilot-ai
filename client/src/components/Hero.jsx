import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
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

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-4xl font-bold">$2.4k</h3>
            <p className="text-gray-400 mt-2">Average yearly savings</p>
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