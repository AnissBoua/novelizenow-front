import { defineStore } from "pinia";
import axios from "axios";
import router from "../router/index"

export const useAuth = defineStore("auth", {
  state: () => {
    return {
      token: localStorage.getItem("token"),
    };
  },
  getters: {
    getToken: (state) => state.token,
  },
  actions: {
    setToken(token) {
      this.token = token;
      if (token === null) {
        localStorage.removeItem("token");
      } else {
        localStorage.setItem("token", token);
      }
    },
    async verifyToken() {
      try {
        const user = await this.me();
        if (user !== false) {
          return {
            type: "user",
            status: user.status,
            data: user.data,
          };
        }
      } catch (error) {
        const errorData = JSON.parse(error.message);

        // if the token is expired
        if (
          errorData.status === 401 &&
          errorData.response.data.message === "Expired JWT Token"
        ) {
          // refresh the token
          const refresh = await this.refreshToken();
          if (refresh !== false && refresh.type !== "Deconnection") {
            return {
              type: "refresh",
              status: refresh.status,
              // data: refresh.data
            };
          }
        } else if (errorData.status === 401) {
          this.setToken(null);
          localStorage.removeItem("refresh_token");
        }
        return false;
      }
    },
    async me() {
      const token = localStorage.getItem("token");

      if (token) {
        const headers = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          // check if token is valid
          const response = await axios.get(
            import.meta.env.VITE_BACK_URL + "api/me",
            headers
          );
          return {
            data: response.data,
            status: response.status,
          };
        } catch (error) {
          throw new Error(
            JSON.stringify({
              response: error.response,
              status: error.response.status,
            })
          );
        }
      } else {
        return false;
      }
    },
    decodeToken(token) {
      if (token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        return JSON.parse(jsonPayload);
      } else {
        return false;
      }
    },

    logout(){
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      router.go('/');
    },

    async refreshToken() {
      const refreshToken = localStorage.getItem("refresh_token");
      const data = {
        refresh_token: refreshToken,
      };
      if (refreshToken) {
        try {
          // try to refresh the token
          const res = await axios.post("/token/refresh", data);
          return res
        } catch (error) {
          return error;
        }
      } else {
        this.setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
      }
      throw new Error("No refresh token");
    },
  },
});
