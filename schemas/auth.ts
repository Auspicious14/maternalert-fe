import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .email('Please enter a valid email address'),
  password: z
    .string( 'Password is required' )
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .email('Please enter a valid email address'),
  password: z
    .string( 'Password is required' )
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

