import axios from "axios";

const authResetApi = axios.create({
    baseURL: "http://localhost:8082",
    });

    authResetApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
    });

    export const resetPassword = async (data) => {
    const response = await authResetApi.put("/auth/reset-password", data);
    return response.data;
};