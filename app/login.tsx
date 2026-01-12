import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login({ email, password });
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen style={styles.container} backgroundColor="#F9FAFB">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#1A212E" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>Sign In</Typography>
          <Typography variant="body" style={styles.subtitle}>
            Welcome back! Please enter your details.
          </Typography>

          <View style={styles.form}>
            <Input 
              label="Email Address" 
              placeholder="example@email.com" 
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input 
              label="Password" 
              placeholder="••••••••" 
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {loginError && (
              <Typography variant="caption" color={Theme.colors.emergencyText} style={styles.errorText}>
                Invalid email or password. Please try again.
              </Typography>
            )}
          </View>

          <Button 
            title={isLoggingIn ? "Signing In..." : "Sign In"} 
            onPress={handleLogin}
            disabled={isLoggingIn || !email || !password}
            containerStyle={styles.signInButton}
          />

          <View style={styles.footer}>
            <Typography variant="body" color={Theme.colors.textLight}>
              Don't have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={() => router.push('/onboarding')}>
              <Typography variant="body" style={styles.link}>Sign Up</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: Theme.spacing.l,
    paddingTop: Theme.spacing.m,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: Theme.colors.textLight,
    marginBottom: 40,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  errorText: {
    textAlign: 'center',
  },
  signInButton: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: Theme.colors.primary,
    fontWeight: 'bold',
  }
});
