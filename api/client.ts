import axios from "axios";
import { appEvents } from "./event-emitter";
import { TokenStorage } from "./storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (__DEV__) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    }
    const token = await TokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;

      const refreshToken = await TokenStorage.getRefreshToken();

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } =
            refreshResponse.data;

          await TokenStorage.saveToken(accessToken);
          await TokenStorage.saveRefreshToken(newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed — session is dead
          await TokenStorage.clearTokens();
          appEvents.emit("session-expired");
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token at all — clear and kick out
        await TokenStorage.clearTokens();
        appEvents.emit("session-expired");
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

export const fetcher = (url: string) => apiClient.get(url).then(res => res.data);
