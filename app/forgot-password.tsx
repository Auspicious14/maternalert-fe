import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Button } from "../components/shared/Button";
import { Input } from "../components/shared/Input";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useAuth } from "../hooks/useAuth";
import { useColorScheme } from "../hooks/use-color-scheme";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, isForgotLoading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForgot = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError(null);
    try {
      await forgotPassword({ email });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Forgot password failed", err);
      setError("An error occurred. Please try again.");
    }
  };

  const iconColor = isDark ? "#FFFFFF" : "#1A212E";

  if (isSubmitted) {
    return (
      <Screen safe={true} scrollable={true}>
        <View className="px-10 pt-20 items-center">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
            <Ionicons name="mail-unread-outline" size={40} color={Theme.colors.primary} />
          </View>
          <Typography variant="h1" className="text-center mb-4">Check Your Email</Typography>
          <Typography variant="body" className="text-center mb-10">
            If an account exists for {email}, you will receive a password reset link shortly.
          </Typography>
          <Button 
            title="Back to Login" 
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
          Forgot Password
        </Typography>
        <Typography variant="body" className="mb-10 text-center">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </Typography>

        <View className="gap-4 mb-8">
          <Input
            label="Email Address"
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            error={error || undefined}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Button
          title={isForgotLoading ? "Sending..." : "Send Reset Link"}
          onPress={handleForgot}
          disabled={isForgotLoading || !email}
          className="mb-6"
        />
      </View>
    </Screen>
  );
}
