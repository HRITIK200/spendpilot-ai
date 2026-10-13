import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommandPalette from "./components/CommandPalette";
import { Loader2 } from "lucide-react";

// Lazy load route pages for optimal bundle splitting
const Home = lazy(() => import("./pages/Home"));
const AuditForm = lazy(() => import("./pages/AuditForm"));
const Results = lazy(() => import("./pages/Results"));
const PublicReport = lazy(() => import("./pages/PublicReport"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white">
      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 animate-pulse">
        <Loader2 size={22} className="animate-spin" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Loading SpendPilot AI...
      </p>
    </div>
  );
}

function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = () => {
      setIsCommandPaletteOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  return (
    <BrowserRouter>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<AuditForm />} />
          <Route path="/results" element={<Results />} />
          <Route path="/report/:id" element={<PublicReport />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;