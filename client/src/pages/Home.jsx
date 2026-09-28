import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    document.title = "SpendPilot AI";
    if (isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
    </div>
  );
}

export default Home;