import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE}/api/auth/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE}/api/auth/login`, credentials);
  return response.data;
};

export const getMe = async (token) => {
  const response = await axios.get(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserReports = async (token) => {
  const response = await axios.get(`${API_BASE}/api/reports/user/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const sendReportEmail = async (reportId, payload) => {
  const response = await axios.post(
    `${API_BASE}/api/reports/${reportId}/email`,
    payload
  );
  return response.data;
};
