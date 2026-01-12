import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isRegistering, registerError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await register({ name, email, password });
    } catch (error) {
      console.error('Registration failed', error);
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
        <Typography variant="h1" className="text-[32px] font-black mb-2 shadow-lexend-bold">Create Account</Typography>
        <Typography variant="body" className="text-gray-500 mb-10">
          Join us to track your pregnancy safely.
        </Typography>

        <View className="gap-4 mb-8">
          <Input 
            label="Full Name" 
            placeholder="Jane Doe" 
            value={name}
            onChangeText={setName}
          />
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
          {registerError && (
            <Typography variant="caption" color={Theme.colors.emergencyText} className="text-center">
              Registration failed. Please try again.
            </Typography>
          )}
        </View>

        <Button 
          title={isRegistering ? "Creating Account..." : "Continue"} 
          onPress={handleRegister}
          disabled={isRegistering || !email || !password || !name}
          className="mb-6"
        />

        <View className="flex-row justify-center items-center">
          <Typography variant="body" className="text-gray-500">
            Already have an account?{' '}
          </Typography>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Typography variant="body" className="text-primary font-bold">Sign In</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
