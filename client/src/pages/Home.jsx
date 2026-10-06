import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AIEcosystem from "../components/AIEcosystem";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    document.title = "SpendPilot AI - Enterprise AI SaaS Cost Optimization";
    if (isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  return (
    <div className="bg-[#030712] min-h-screen text-white flex flex-col justify-between">
      <Navbar />
      <Hero />
      <AIEcosystem />
      <Features />
      <FAQ />
      <Footer />
    </div>
  );
}

export default Home;