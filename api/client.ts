import axios from "axios";
import { Platform } from "react-native";
import { TokenStorage } from "./storage";

const LOCAL_IP = "192.168.237.47"; 

// Priority: Environment Variable > Local IP (for phone) > Localhost (for emulator/web)
const BASE_URL = process.env.API_URL 
  ? `${process.env.API_URL}/api/v1` 
  : `http://${LOCAL_IP}:2005/api/v1`;

if (__DEV__) {
  console.log("-----------------------------------------");
  console.log("🚀 API Base URL:", BASE_URL);
  console.log("📱 Device Platform:", Platform.OS);
  console.log("💻 Local IP used:", LOCAL_IP);
  console.log("-----------------------------------------");
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Reduced timeout to fail faster during debugging
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
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`📥 ${response.status} from ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (__DEV__) {
      if (error.message === "Network Error") {
        console.error("‼️ NETWORK ERROR DETECTED:");
        console.error(`1. Open this URL in your PHONE'S BROWSER: http://${LOCAL_IP}:2005/api/v1/health`);
        console.error("2. If it works in the browser but not here, it's an Expo/App issue.");
        console.error("3. If it DOES NOT work in the browser, your phone cannot see your computer.");
        console.error("   - Check if you are on the SAME Wi-Fi.");
        console.error("   - Check if your router has 'AP Isolation' enabled.");
      } else {
        console.warn("⚠️ API Error:", error.message, error.response?.status);
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await TokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
          await TokenStorage.saveToken(accessToken);
          await TokenStorage.saveRefreshToken(newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          await TokenStorage.clearTokens();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
