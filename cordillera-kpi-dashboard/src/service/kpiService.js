import axios from "axios";

const kpiApi = axios.create({
    baseURL: "http://localhost:8080",
});

export const createKpi = async (data) => {
    const response = await kpiApi.post("/api/kpis", data);
    return response.data;
};

export const getKpis = async () => {
    const response = await kpiApi.get("/api/kpis");
    return response.data;
};