import axios from "axios";
import { getApiBaseUrl } from "./apiConfig";

const getEndpoint = (path = "") => `${getApiBaseUrl()}/api/reports${path}`;

export const saveReport = async (reportData) => {
  const token = localStorage.getItem("spendpilot_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios.post(getEndpoint(), reportData, { headers });
  return response.data;
};

export const getReportById = async (id) => {
  const response = await axios.get(getEndpoint(`/${id}`));
  return response.data;
};

export const getUserReports = async () => {
  const token = localStorage.getItem("spendpilot_token");
  if (!token) return [];
  const response = await axios.get(getEndpoint("/user/history"), {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const sendReportEmail = async (reportId, payload) => {
  const response = await axios.post(getEndpoint(`/${reportId}/email`), payload);
  return response.data;
};