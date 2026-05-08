import axios from "axios";

const kpiApi = axios.create({
    baseURL: "http://localhost:8082",
    });

    kpiApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
    });

    export const createKpi = async (data) => {
    const response = await kpiApi.post("/api/kpis", data);
    return response.data;
    };