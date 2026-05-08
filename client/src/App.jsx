import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuditForm from "./pages/AuditForm";
import Results from "./pages/Results";
import PublicReport from "./pages/PublicReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/audit" element={<AuditForm />} />
        <Route path="/results" element={<Results />} />
        <Route path="/report/:id" element={<PublicReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;