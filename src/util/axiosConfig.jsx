import axios from "axios";
import { BASE_URL } from "./apiEndpoint";

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json", // ✅ fixed
    Accept: "application/json",
  },
});

// list of endpoints that do not require auth header
const excludeEndPoints = [
  "/login",
  "/register",
  "/status",
  "/activate",
  "/health",
];

// request interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    const shouldSkipToken = excludeEndPoints.some(
      (endpoint) => config.url?.includes(endpoint) // ✅ fixed
    );

    if (!shouldSkipToken) {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// response interceptor
axiosConfig.interceptors.response.use(
  (response) => {
    // Pass successful responses straight through
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token expired or invalid → log out user
        localStorage.removeItem("token");
        window.location.href = "/login"; // redirect to login page
      }

      if (status === 403) {
        console.warn("Forbidden: You don’t have access to this resource.");
      }

      if (status === 500) {
        console.error("Server error, please try again later.");
      } else if (error.code === "ECONNABORTED") {
        console.error("Request time out. please try again");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;
