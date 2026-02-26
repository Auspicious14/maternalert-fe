import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, TouchableOpacity, View } from "react-native";
import { Button } from "../components/shared/Button";
import { Input } from "../components/shared/Input";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useAuth } from "../hooks/useAuth";
import { RegisterFormData, registerSchema } from "../schemas/auth";
import { useColorScheme } from "../hooks/use-color-scheme";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isRegistering, registerError } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register(data);
    } catch (e) {
      // Error handled by useAuth mutation state
    }
  };

  const getErrorMessage = () => {
    if (!registerError) return null;
    const errorData = (registerError as any).response?.data;
    if (errorData?.statusCode === 409) {
      return "This email is already registered. Please login instead.";
    }
    return "Registration failed. Please try again.";
  };

  const errorMessage = getErrorMessage();
  const iconColor = isDark ? "#FFFFFF" : "#1A212E";

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
          className="text-[32px] font-black mb-2 shadow-lexend-bold text-center"
        >
          Create Account
        </Typography>
        <Typography variant="body" className="mb-10 text-center">
          Join us to track your pregnancy safely.
        </Typography>

        <View className="gap-4 mb-8">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                placeholder="example@email.com"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="••••••••"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
                showPasswordToggle
              />
            )}
          />

          {errorMessage && (
            <View
              style={{
                backgroundColor: isDark ? "rgba(239, 68, 68, 0.1)" : "#FEF2F2",
                borderColor: isDark ? "rgba(239, 68, 68, 0.2)" : "#FEE2E2",
              }}
              className="p-3 rounded-xl border"
            >
              <Typography
                variant="caption"
                color={Theme.colors.emergencyText}
                className="text-center font-medium"
              >
                {errorMessage}
              </Typography>
            </View>
          )}
        </View>

        <Button
          title={isRegistering ? "Creating Account..." : "Continue"}
          onPress={handleSubmit(handleRegister)}
          disabled={isRegistering || !isValid}
          className="mb-6"
        />

        <View className="flex-row justify-center items-center mb-10">
          <Typography variant="body">Already have an account? </Typography>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Typography
              variant="body"
              color={Theme.colors.primary}
              className="font-bold"
            >
              Login
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
