import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Button } from "../components/shared/Button";
import { Input } from "../components/shared/Input";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useAuth } from "../hooks/useAuth";
import { useColorScheme } from "../hooks/use-color-scheme";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { resetPassword, isResetLoading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setError(null);
    try {
      await resetPassword({ token, newPassword });
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Reset password failed", err);
      setError("Failed to reset password. The link may have expired.");
    }
  };

  const iconColor = isDark ? "#FFFFFF" : "#1A212E";

  if (isSuccess) {
    return (
      <Screen safe={true} scrollable={true}>
        <View className="px-10 pt-20 items-center">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark-circle-outline" size={40} color={Theme.colors.primary} />
          </View>
          <Typography variant="h1" className="text-center mb-4">Password Reset!</Typography>
          <Typography variant="body" className="text-center mb-10">
            Your password has been successfully reset. You can now log in with your new password.
          </Typography>
          <Button 
            title="Go to Login" 
            onPress={() => router.replace("/login")} 
            className="w-full"
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen safe={true} scrollable={true}>
      <View className="px-6 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={28} color={iconColor} />
        </TouchableOpacity>
      </View>

      <View className="px-10 pt-5">
        <View className="items-center">
          <Image
            source={require("../assets/images/matern-logo.png")}
            className="w-32 h-32"
            resizeMode="cover"
          />
        </View>

        <Typography
          variant="h1"
          className="text-[32px] font-black mb-2 text-center"
        >
          Reset Password
        </Typography>
        <Typography variant="body" className="mb-10 text-center">
          Please enter your new password below.
        </Typography>

        <View className="gap-4 mb-8">
          <Input
            label="New Password"
            placeholder="••••••••"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            showPasswordToggle
          />
          <Input
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            showPasswordToggle
            error={error || undefined}
          />
        </View>

        <Button
          title={isResetLoading ? "Resetting..." : "Reset Password"}
          onPress={handleReset}
          disabled={isResetLoading || !newPassword || !confirmPassword}
          className="mb-6"
        />
      </View>
    </Screen>
  );
}
