import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { LoginFormData, loginSchema } from '../schemas/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Screen backgroundColor="#F9FAFB" safe={true} scrollable={true}>
      <View className="px-6 pt-4">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 justify-center items-center">
          <Ionicons name="arrow-back" size={28} color="#1A212E" />
        </TouchableOpacity>
      </View>

      <View className="px-10 pt-5">
        <Typography variant="h1" className="text-[32px] font-black mb-2 shadow-lexend-bold">Sign In</Typography>
        <Typography variant="body" className="text-gray-500 mb-10">
          Welcome back! Please enter your details.
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
              />
            )}
          />

          {loginError && (
            <Typography variant="caption" color={Theme.colors.emergencyText} className="text-center">
              Invalid email or password. Please try again.
            </Typography>
          )}
        </View>

        <Button 
          title={isLoggingIn ? "Signing In..." : "Sign In"} 
          onPress={handleSubmit(handleLogin)}
          disabled={isLoggingIn || !isValid}
          className="mb-6"
        />

        <View className="flex-row justify-center items-center">
          <Typography variant="body" className="text-gray-500">
            Don't have an account?{' '}
          </Typography>
          <TouchableOpacity onPress={() => router.push('/onboarding')}>
            <Typography variant="body" className="text-primary font-bold">Sign Up</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
