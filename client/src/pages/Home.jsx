import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import { useEffect } from "react";

function Home() {

  useEffect(() => {
  document.title = "SpendPilot AI";
   }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}

export default Home;