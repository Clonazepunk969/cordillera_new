import axios from "axios";

const authSessionApi = axios.create({
    baseURL: "http://localhost:8082",
    });

    export const validateToken = async () => {
    const token = localStorage.getItem("token");

    const response = await authSessionApi.get("/auth/validate-token", {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};