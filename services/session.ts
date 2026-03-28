import apiClient from "../api/client";
import { TokenStorage } from "../api/storage";

export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
export const SESSION_WARNING_MS = 25 * 60 * 1000; // 25 minutes

class SessionService {
  private lastActivity: number = Date.now();
  private timeoutId: any = null;
  private warningId: any = null;
  private onSessionExpired: (() => void) | null = null;
  private onSessionWarning: (() => void) | null = null;

  constructor() {
    this.updateActivity();
  }

  updateActivity() {
    this.lastActivity = Date.now();
    this.resetTimers();
  }

  private resetTimers() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.warningId) clearTimeout(this.warningId);

    this.warningId = setTimeout(() => {
      if (this.onSessionWarning) {
        this.onSessionWarning();
      }
    }, SESSION_WARNING_MS);

    this.timeoutId = setTimeout(() => {
      this.expireSession();
    }, SESSION_TIMEOUT_MS);
  }

  private expireSession() {
    if (this.onSessionExpired) {
      this.onSessionExpired();
    }
    this.clearSession();
  }

  async clearSession() {
    await TokenStorage.clearTokens();
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.warningId) clearTimeout(this.warningId);
  }

  setCallbacks(onExpired: () => void, onWarning: () => void) {
    this.onSessionExpired = onExpired;
    this.onSessionWarning = onWarning;
  }

  async checkAuth() {
    const token = await TokenStorage.getToken();
    if (!token) return false;
    try {
      await apiClient.get("/auth/me");
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const sessionService = new SessionService();
