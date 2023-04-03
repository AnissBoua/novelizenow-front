import axios from "axios";

axios.interceptors.request.use(function (config) {
  config.baseURL = import.meta.env.VITE_BACK_URL + "api/";
  config.headers = {
    "Content-type": "application/json",
    Accept: "application/json",
    Authorization: localStorage.getItem("token")
      ? `Bearer ${localStorage.getItem("token")}`
      : "",
  };
  return config;
});
