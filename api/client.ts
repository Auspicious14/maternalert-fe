import axios from "axios";
import Constants from "expo-constants";
import { appEvents } from "./event-emitter";
import { TokenStorage } from "./storage";

// Fall back to app.json "extra.apiUrl" so a build made without the .env file
// doesn't silently ship with an undefined API URL (every request would fail,
// including emergency alerts).
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiUrl as string | undefined);

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
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

/**
 * Single shared refresh. The backend rotates the refresh token and rejects the
 * old one, so when several requests got 401 at the same time each refreshed
 * with the same token: the first won, the rest failed, and the user was logged
 * out. Now concurrent 401s wait for one refresh.
 */
let refreshInFlight: Promise<string> | null = null;

function refreshAccessToken(refreshToken: string): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = axios
      .post(`${BASE_URL}/auth/refresh`, { refreshToken }, { withCredentials: true })
      .then(async (refreshResponse) => {
        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        await TokenStorage.saveToken(accessToken);
        await TokenStorage.saveRefreshToken(newRefreshToken);
        return accessToken as string;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      // /auth/me must refresh too: it's the first call when the app opens.
      !/\/auth\/(login|register|refresh|logout|forgot|reset|verify)/.test(originalRequest.url ?? "")
    ) {
      originalRequest._retry = true;

      const refreshToken = await TokenStorage.getRefreshToken();

      if (refreshToken) {
        try {
          const accessToken = await refreshAccessToken(refreshToken);
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
