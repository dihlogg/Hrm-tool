import axios from "axios";
import Cookies from "js-cookie";
import { refreshAccessToken } from "./refreshAccessToken";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request: gắn access token
instance.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: handle 401 → refresh → retry
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        onRefreshed(newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        isRefreshing = false;
        return instance(originalRequest);
      } else {
        isRefreshing = false;
        return Promise.reject(new Error("Session expired. Please login again."));
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
