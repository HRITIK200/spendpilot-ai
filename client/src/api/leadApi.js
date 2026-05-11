import axios from "axios";

const API =
  `${import.meta.env.VITE_API_BASE_URL}/api/leads`;

export const saveLead = async (
  leadData
) => {

  const response =
    await axios.post(
      API,
      leadData
    );

  return response.data;
};