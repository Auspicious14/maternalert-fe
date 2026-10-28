import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Linking, Pressable, Text, TextInput, View } from "react-native";

import { AuthShell, Banner, Button, FONT, T, TextField, friendlyApiError, useTokens } from "../components/ds";
import { useAuth } from "../hooks/useAuth";
import { RegisterFormData, loginIdentifier, registerSchema } from "../schemas/auth";
import { useLang } from "../hooks/useLang";
import { tx } from "../services/pidgin";

// Same screen as maternalert-web/src/app/(patient)/register/page.tsx

const RULES: { label: string; test: (v: string) => boolean }[] = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "A capital letter", test: (v) => /[A-Z]/.test(v) },
  { label: "A small letter", test: (v) => /[a-z]/.test(v) },
  { label: "A number", test: (v) => /[0-9]/.test(v) },
];

export default function RegisterScreen() {
  const router = useRouter();
  useLang();
  const t = useTokens();
  const { register, isRegistering, registerError } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });
  const password = watch("password") ?? "";

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({ ...loginIdentifier(data.email), password: data.password });
    } catch {
      // shown below from registerError
    }
  };

  const apiError = registerError
    ? friendlyApiError(registerError, {
        409: tx("This phone number or email already has an account. Sign in instead, or use “Forgot password”."),
      })
    : null;

  return (
    <AuthShell title={tx("Create your account")} subtitle={tx("Free for mothers. Takes about 2 minutes.")} onBack={() => router.back()}>
      <View style={{ gap: 16 }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={tx("Phone number or email")}
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
              error={(errors.email?.message ? tx(errors.email.message) : undefined)}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              ref={passwordRef}
              label={tx("Create a password")}
              password
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="go"
              onSubmitEditing={handleSubmit(onSubmit)}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              // The checklist explains the rules; only show the error after submit.
              error={isSubmitted ? (errors.password?.message ? tx(errors.password.message) : undefined) : undefined}
              hint={
                <View style={{ gap: 4 }} accessibilityLabel="Password rules">
                  {RULES.map((r) => {
                    const ok = r.test(password);
                    return (
                      <View
                        key={tx(r.label)}
                        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                        accessible
                        accessibilityLabel={`${tx(r.label)}, ${ok ? "done" : "needed"}`}
                      >
                        <Ionicons name={ok ? "checkmark" : "ellipse-outline"} size={ok ? 16 : 12} color={ok ? t.greenInk : t.muted} />
                        <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: ok ? t.greenInk : t.muted }}>{tx(r.label)}</Text>
                      </View>
                    );
                  })}
                </View>
              }
            />
          )}
        />

        {apiError ? <Banner tone="red">{apiError}</Banner> : null}

        <Button size="lg" block onPress={handleSubmit(onSubmit)} loading={isRegistering} disabled={isRegistering}>
          {isRegistering ? tx("Creating account…") : tx("Continue")}
        </Button>
        <T variant="small" style={{ textAlign: "center" }}>
          {tx("By continuing you agree to our")}{" "}
          <Text style={{ color: t.greenInk, fontFamily: FONT.semibold }} onPress={() => Linking.openURL("https://maternalert.com.ng/terms")}>
            {tx("Terms")}
          </Text>{" "}
          {tx("and")}{" "}
          <Text style={{ color: t.greenInk, fontFamily: FONT.semibold }} onPress={() => Linking.openURL("https://maternalert.com.ng/privacy")}>
            {tx("Privacy Policy")}
          </Text>
          .
        </T>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 4 }}>
        <T>{tx("Already have an account?")}</T>
        <Pressable onPress={() => router.push("/login")} accessibilityRole="link">
          <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.greenInk, textDecorationLine: "underline" }}>
            {tx("Sign in")}
          </Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}
