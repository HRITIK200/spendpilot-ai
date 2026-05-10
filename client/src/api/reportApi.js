import axios from "axios";

const API =
  import.meta.env.VITE_API_URL;


// SAVE REPORT

export const saveReport = async (data) => {

  const response =
    await axios.post(API, data);

  return response.data;
};


// GET REPORT

export const getReport = async (id) => {

  const response =
    await axios.get(`${API}/${id}`);

  return response.data;
};
console.log(import.meta.env.VITE_API_URL);