import axios from "axios";

const reportApi = axios.create({
  baseURL: "http://localhost:8081",
});

export const getReports = async () => {
  const response = await reportApi.get("/api/reports");
  return response.data;
};

export const createReport = async (data) => {
  const response = await reportApi.post("/api/reports", data);
  return response.data;
};

export const downloadReportPdf = async (id) => {
  const response = await reportApi.get(`/api/reports/${id}/pdf`, {
    responseType: "blob",
  });

  return response.data;
};