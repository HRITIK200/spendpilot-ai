import axios from "axios";
import { getApiBaseUrl } from "./apiConfig";

const getEndpoint = (path = "") => `${getApiBaseUrl()}${path}`;

export const registerUser = async (userData) => {
  const response = await axios.post(getEndpoint("/api/auth/register"), userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(getEndpoint("/api/auth/login"), credentials);
  return response.data;
};

export const getMe = async (token) => {
  const response = await axios.get(getEndpoint("/api/auth/me"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserReports = async (token) => {
  const response = await axios.get(getEndpoint("/api/reports/user/history"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const sendReportEmail = async (reportId, payload) => {
  const response = await axios.post(
    getEndpoint(`/api/reports/${reportId}/email`),
    payload
  );
  return response.data;
};
