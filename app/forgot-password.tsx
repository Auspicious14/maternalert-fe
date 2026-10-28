import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

import { AuthShell, Banner, Button, TextField } from "../components/ds";
import { useAuth } from "../hooks/useAuth";
import { loginIdentifier } from "../schemas/auth";

// Same screen as maternalert-web/src/app/(patient)/forgot-password/page.tsx

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, isForgotLoading } = useAuth();
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const v = value.trim();
    const ok = v.includes("@") ? /^\S+@\S+\.\S+$/.test(v) : v.replace(/\D/g, "").length >= 10;
    if (!ok) return setError("Enter your phone number (e.g. 0803 123 4567) or email address.");
    setError(null);
    try {
      await forgotPassword(loginIdentifier(v));
      setSent(true);
    } catch {
      setError("We couldn't send it. Check your internet and try again.");
    }
  };

  if (sent) {
    const byPhone = !value.includes("@");
    return (
      <AuthShell title={byPhone ? "Check your messages" : "Check your email"}>
        <Banner tone="green" icon="chatbox-ellipses-outline">
          {byPhone
            ? "If this number has a MaternAlert account, we've sent an SMS with a link to choose a new password. It works for 1 hour."
            : "If this email has a MaternAlert account, we've sent a link to choose a new password. It works for 1 hour."}
        </Banner>
        <Button size="lg" block onPress={() => router.replace("/login")}>
          Back to sign in
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter the phone number or email you use for MaternAlert. We'll send you a link to choose a new password."
      onBack={() => router.back()}
    >
      <View style={{ gap: 16 }}>
        <TextField
          label="Phone number or email"
          placeholder="0803 123 4567"
          autoCapitalize="none"
          autoComplete="username"
          textContentType="username"
          returnKeyType="send"
          onSubmitEditing={submit}
          value={value}
          onChangeText={setValue}
          error={error ?? undefined}
        />
        <Button size="lg" block onPress={submit} loading={isForgotLoading} disabled={isForgotLoading || !value.trim()}>
          Send me a link
        </Button>
      </View>
    </AuthShell>
  );
}
