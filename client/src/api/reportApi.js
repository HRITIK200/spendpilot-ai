import axios from "axios";

const API =
  `${import.meta.env.VITE_API_BASE_URL}/api/reports`;

export const saveReport = async (
  reportData
) => {

  const response =
    await axios.post(
      API,
      reportData
    );

  return response.data;
};

export const getReportById =
  async (id) => {

    const response =
      await axios.get(
        `${API}/${id}`
      );

    return response.data;
};