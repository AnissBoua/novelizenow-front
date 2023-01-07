import { defineStore } from 'pinia'
import axios from 'axios'
import helper from '@/config/helper'

export const useAuth = defineStore('auth', {
    state: () => {
        return {
            token: localStorage.getItem('token')
        }
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
        async verifyToken(){
            try {
                const user = await this.me();
                if (user !== false) {
                    return {
                        type: "user",
                        status: user.status,
                        data: user.data
                    }
                }
            } catch (error) {
                const errorData = JSON.parse(error.message);
    
                // if the token is expired
                if (errorData.status === 401 && errorData.response.data.message ===  "Expired JWT Token") {
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
                    this.setToken(null)
                    localStorage.removeItem("refresh_token");
                }
                return false;
            }
        },
        async me(){
            const token = localStorage.getItem("token");
    
            if (token) {
                const headers = {
                    headers: {
                        Authorization: `Bearer ${token}`
                      }
                }
            
                try {
                    // check if token is valid
                    const response = await axios.get(helper.path + 'me', headers);
                    return {
                        data: response.data,
                        status: response.status,
                    };
                } catch (error) {
                    throw new Error(JSON.stringify(
                        {
                            response: error.response,
                            status: error.response.status,
                        }
                    ))
                }
            } else {
                return false;
            }
        },
    
        async refreshToken(){
            const refreshToken = localStorage.getItem("refresh_token");
            const data = {
                refresh_token: refreshToken
            }
            if (refreshToken) {
                try {
                    // try to refresh the token
                    const res = await axios.post(helper.path + "token/refresh", data);
    
                    // if it's okay set new token
                    if (res.status === 200) {
                        this.setToken(res.data.token);
                        return {
                            data: res.data,
                            status: res.status,
                        };
                    }
                } catch (error) {
                    if (error.response.status === 401 && error.response.data.message === "Invalid JWT Refresh Token") {
                        this.setToken(null)
                        localStorage.removeItem("refresh_token");
                    }
    
                    return false;
                }
            }else{
                return false;
            }
        }
    },
})
