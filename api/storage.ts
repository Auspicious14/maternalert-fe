import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "maternalert_auth_token";
const REFRESH_TOKEN_KEY = "maternalert_refresh_token";
const HAS_LAUNCHED_KEY = "maternalert_has_launched";
const LAST_LOCATION_KEY = "maternalert_last_location";

export const TokenStorage = {
  async saveToken(token: string) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving token", error);
    }
  },

  async getToken() {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token", error);
      return null;
    }
  },

  async saveRefreshToken(token: string) {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving refresh token", error);
    }
  },

  async getRefreshToken() {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token", error);
      return null;
    }
  },

  async clearTokens() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error clearing tokens", error);
    }
  },

  async setHasLaunched() {
    try {
      await SecureStore.setItemAsync(HAS_LAUNCHED_KEY, "true");
    } catch (error) {
      console.error("Error setting launch flag", error);
    }
  },

  async getHasLaunched() {
    try {
      return await SecureStore.getItemAsync(HAS_LAUNCHED_KEY);
    } catch (error) {
      console.error("Error getting launch flag", error);
      return null;
    }
  },

  async saveLastLocation(location: { latitude: number; longitude: number }) {
    try {
      await SecureStore.setItemAsync(LAST_LOCATION_KEY, JSON.stringify(location));
    } catch (error) {
      console.error("Error saving location", error);
    }
  },

  async getLastLocation() {
    try {
      const locationStr = await SecureStore.getItemAsync(LAST_LOCATION_KEY);
      return locationStr ? JSON.parse(locationStr) : null;
    } catch (error) {
      console.error("Error getting location", error);
      return null;
    }
  },
};
