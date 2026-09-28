import axios from "axios";
import { getApiBaseUrl } from "./apiConfig";

export const saveLead = async (leadData) => {
  const API = `${getApiBaseUrl()}/api/leads`;
  const response = await axios.post(API, leadData);
  return response.data;
};