import axios from "axios";

const authApi = axios.create({
    baseURL: "http://localhost:8082",
    });

    export const login = async (data) => {
    const response = await authApi.post("/auth/login", data);
    return response.data;
    };

    export const register = async (data) => {
    const response = await authApi.post("/auth/register", data);
    return response.data;
};