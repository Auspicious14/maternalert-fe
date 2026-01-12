import axios from "axios";
import { TokenStorage } from "./storage";

// In a real development environment, this would be an environment variable
// For this workspace demo, we assume the backend is running locally
const BASE_URL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor for Adding Auth Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await TokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Error Handling and Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token Expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await TokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          // Attempt to refresh token
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } =
            refreshResponse.data;

          await TokenStorage.saveToken(accessToken);
          await TokenStorage.saveRefreshToken(newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, clear tokens and redirect to login if necessary
          await TokenStorage.clearTokens();
          return Promise.reject(refreshError);
        }
      }
    }

    // Clinical Safety Error Logging
    // We don't log health data to console in production
    if (__DEV__) {
      console.warn("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
