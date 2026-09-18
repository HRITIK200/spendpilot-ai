import Results from "./Results";

/**
 * PublicReport wrapper component
 * Delegates rendering to Results.jsx which dynamically handles:
 * - Fetching report by :id from the backend API
 * - Responsive layout across all device viewports
 * - Full charts, score ring, redundancy alerts, and export options
 */
const PublicReport = () => {
  return <Results />;
};

export default PublicReport;