import axios from "axios";

const authResetApi = axios.create({
  baseURL: "http://localhost:8080",
});

authResetApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const resetPassword = async (data) => {
  const response = await authResetApi.put("/api/auth/reset-password", data);
  return response.data;
};