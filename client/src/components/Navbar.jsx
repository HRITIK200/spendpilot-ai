import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#030712]/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link to="/" className="text-2xl font-bold">
          SpendPilot AI
        </Link>

        <div className="flex items-center gap-6">
          <a href="#features" className="text-gray-300 hover:text-white transition">
            Features
          </a>

          <a href="#faq" className="text-gray-300 hover:text-white transition">
            FAQ
          </a>

          <Link
            to="/audit"
            className="bg-white text-black px-5 py-2 rounded-xl font-medium hover:scale-105 transition"
          >
            Start Audit
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;