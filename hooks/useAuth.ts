import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";
import { TokenStorage } from "../api/storage";
import { useAuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { login: loginContext } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      // Let AuthContext handle everything — tokens, cache, routing
      await loginContext(data.accessToken, data.refreshToken, data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: async (data) => {
      // Save tokens then set user-session so AuthContext guard fires
      await TokenStorage.saveToken(data.accessToken);
      await TokenStorage.saveRefreshToken(data.refreshToken);
      queryClient.setQueryData(["user-session"], data.user);
      // AuthContext guard will redirect to /(tabs) automatically
      // profile-setup redirect needs to be handled separately
      // since new users shouldn't go to /(tabs) yet
    },
    onError: (err: any) => {
      console.log("Registration Error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { email?: string; phone?: string }) => {
      const response = await apiClient.post("/auth/forgot-password", data);
      return response.data;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      const response = await apiClient.post("/auth/reset-password", data);
      return response.data;
    },
  });

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error: any) {
      console.log("Logout Error:", error.message);
    } finally {
      await TokenStorage.clearTokens();
      queryClient.clear();
      queryClient.setQueryData(["user-session"], null);
    }
    // AuthContext guard will redirect to /login automatically
  };

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotLoading: forgotPasswordMutation.isPending,
    forgotError: forgotPasswordMutation.error,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResetLoading: resetPasswordMutation.isPending,
    resetError: resetPasswordMutation.error,
    logout,
  };
};
