import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import apiClient from "../api/client";
import { TokenStorage } from "../api/storage";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      await TokenStorage.saveToken(data.accessToken);
      await TokenStorage.saveRefreshToken(data.refreshToken);
      queryClient.setQueryData(["user"], data.user);
      router.replace("/(tabs)");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: async (data) => {
      await TokenStorage.saveToken(data.accessToken);
      await TokenStorage.saveRefreshToken(data.refreshToken);
      queryClient.setQueryData(["user"], data.user);
      router.replace("/profile-setup");
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
      console.log("Logout Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } finally {
      await TokenStorage.clearTokens();
      queryClient.clear();
      router.replace("/login");
    }
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
