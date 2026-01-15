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
import { RegisterFormData, registerSchema } from '../schemas/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isRegistering, registerError } = useAuth();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register(data);
    } catch (e) {
      // Error handled by useAuth mutation state
    }
  };

  // Extract specific error message from the mutation error
  const getErrorMessage = () => {
    if (!registerError) return null;
    const errorData = (registerError as any).response?.data;
    if (errorData?.statusCode === 409) {
      return "This email is already registered. Please login instead.";
    }
    return "Registration failed. Please try again.";
  };

  const errorMessage = getErrorMessage();

  return (
    <Screen backgroundColor="#F9FAFB" safe={true} scrollable={true}>
      <View className="px-6 pt-4">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 justify-center items-center">
          <Ionicons name="arrow-back" size={28} color="#1A212E" />
        </TouchableOpacity>
      </View>

      <View className="px-10 pt-5">
        <Typography variant="h1" className="text-[32px] font-black mb-2 shadow-lexend-bold">Create Account</Typography>
        <Typography variant="body" className="text-gray-500 mb-10">
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
              />
            )}
          />

          {errorMessage && (
            <View className="bg-red-50 p-3 rounded-xl border border-red-100">
              <Typography variant="caption" color={Theme.colors.emergency} className="text-center font-medium">
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
          <Typography variant="body" className="text-gray-500">
            Already have an account?{' '}
          </Typography>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Typography variant="body" color={Theme.colors.primary} className="font-bold">
              Login
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
