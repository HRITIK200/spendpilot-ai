import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const saveReport = async (
  reportData
) => {

  const response = await API.post(
    "/api/reports",
    reportData
  );

  return response.data;
};

export const getReport = async (id) => {

  const response = await API.get(
    `/api/reports/${id}`
  );

  return response.data;
};