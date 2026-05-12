import axios from "axios";

const authSessionApi = axios.create({
  baseURL: "http://localhost:8080",
});

export const validateToken = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    const response = await authSessionApi.get("/api/auth/validate-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status === 200;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
};