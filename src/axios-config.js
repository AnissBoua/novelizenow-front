import axios from "axios";
import { useAuth } from "@/stores/auth.js";

axios.interceptors.request.use(function (config) {
  config.baseURL = import.meta.env.VITE_BACK_URL + "api/";
  if (config.url !== "/token/refresh") {
    config.headers = {
      "Content-type": "application/json",
      Accept: "application/json",
      Authorization: localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}`
        : "",
    };
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response.status === 401 &&
      error.response.config.url != "/token/refresh"
    ) {
      const authStore = useAuth();
      authStore.verifyToken();
    }
    return Promise.reject(error);
  }
);
