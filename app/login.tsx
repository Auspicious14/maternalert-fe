import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

import { AuthShell, Banner, Button, FONT, T, TextField, friendlyApiError, useTokens } from "../components/ds";
import { useAuth } from "../hooks/useAuth";
import { LoginFormData, loginIdentifier, loginSchema } from "../schemas/auth";

// Same screen as maternalert-web/src/app/(patient)/login/page.tsx

export default function LoginScreen() {
  const router = useRouter();
  const t = useTokens();
  const { message } = useLocalSearchParams<{ message?: string }>();
  const { login, isLoggingIn, loginError } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  // useAuth's onSuccess already sets up the session (tokens, routing).
  const onSubmit = async (payload: LoginFormData) => {
    try {
      await login({ ...loginIdentifier(payload.email), password: payload.password });
    } catch {
      // shown below from loginError
    }
  };

  const apiError = loginError
    ? friendlyApiError(loginError, { 401: "That phone number or email and password don't match. Please try again." })
    : null;

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to see your readings and alerts." onBack={() => router.back()}>
      {message === "session_expired" ? (
        <Banner tone="amber">You were signed out to keep your account safe. Please sign in again.</Banner>
      ) : null}

      <View style={{ gap: 16 }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Phone number or email"
              placeholder="0803 123 4567"
              keyboardType="default"
              autoCapitalize="none"
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              ref={passwordRef}
              label="Password"
              password
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleSubmit(onSubmit)}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />
        <Pressable
          onPress={() => router.push("/forgot-password")}
          accessibilityRole="link"
          style={{ alignSelf: "flex-end", minHeight: 44, justifyContent: "center", marginTop: -8 }}
        >
          <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>Forgot password?</Text>
        </Pressable>

        {apiError ? <Banner tone="red">{apiError}</Banner> : null}

        <Button size="lg" block onPress={handleSubmit(onSubmit)} loading={isLoggingIn} disabled={isLoggingIn}>
          {isLoggingIn ? "Signing in…" : "Sign in"}
        </Button>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 4 }}>
        <T>New to MaternAlert?</T>
        <Pressable onPress={() => router.push("/register")} accessibilityRole="link">
          <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.greenInk, textDecorationLine: "underline" }}>
            Create an account
          </Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}
