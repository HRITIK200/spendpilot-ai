/**
 * Bulletproof API Base URL resolver.
 * Ensures that if the app is accessed on mobile, tablets, Vercel, or external devices,
 * it routes to the live Render cloud backend rather than a non-existent localhost on the device.
 */
export const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]";

    // When running on external devices, mobile browsers, or production hosting:
    if (!isLocalhost) {
      if (
        import.meta.env.VITE_API_BASE_URL &&
        !import.meta.env.VITE_API_BASE_URL.includes("localhost")
      ) {
        return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "");
      }
      return "https://spendpilot-backend-84ep.onrender.com";
    }
  }

  // When running locally on developer machine:
  return (
    import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:5000"
  );
};
