import axios from "axios";
import { useAuth } from "@/stores/auth.js";
import { useRoute, useRouter } from 'vue-router'

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

axios.interceptors.response.use( response => {
  return response;
}, async (error) => {
  const authStore = useAuth();
  if (error.response.status === 401 && error.response.config.url != "/token/refresh" ) {
    try {
      const result = await authStore.refreshToken();
      if (result.status === 200) {
        authStore.setToken(result.data.token);
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("refresh_token", result.data.refresh_token);
        window.location.reload();
      }

      if (result.status === 401) {
        authStore.setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // dont use
      }
    } catch (error) {
      authStore.setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  }
  return error;
});