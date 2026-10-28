import { z } from 'zod';

export const registerSchema = z.object({
  // Phone number or email, like sign-in. Many mothers have no email.
  email: z
    .string()
    .trim()
    .min(1, "Enter your phone number or email address")
    .refine(
      (v) => (v.includes("@") ? /^\S+@\S+\.\S+$/.test(v) : v.replace(/\D/g, "").length >= 10),
      "Enter your phone number (e.g. 0803 123 4567) or email address",
    ),
  password: z
    .string( 'Password is required' )
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  // Phone number or email: mothers registered at a clinic often have no email.
  email: z
    .string()
    .trim()
    .min(1, "Enter your phone number or email address")
    .refine(
      (v) => (v.includes("@") ? /^\S+@\S+\.\S+$/.test(v) : v.replace(/\D/g, "").length >= 10),
      "Enter your phone number (e.g. 0803 123 4567) or email address",
    ),
  password: z
    .string( 'Password is required' )
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;


/** Turn what she typed into the login body: { email } or { phone }. */
export function loginIdentifier(raw: string): { email: string } | { phone: string } {
  const v = raw.trim();
  return v.includes("@") ? { email: v.toLowerCase() } : { phone: v.replace(/[^\d+]/g, "") };
}
