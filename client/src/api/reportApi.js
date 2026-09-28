import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE_URL || ""}/api/reports`;

export const saveReport = async (reportData) => {
  const token = localStorage.getItem("spendpilot_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios.post(API, reportData, { headers });
  return response.data;
};

export const getReportById = async (id) => {
  const response = await axios.get(`${API}/${id}`);
  return response.data;
};

export const getUserReports = async () => {
  const token = localStorage.getItem("spendpilot_token");
  if (!token) return [];
  const response = await axios.get(`${API}/user/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const sendReportEmail = async (reportId, payload) => {
  const response = await axios.post(`${API}/${reportId}/email`, payload);
  return response.data;
};