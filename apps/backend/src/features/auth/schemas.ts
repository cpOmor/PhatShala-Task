import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']),
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export const verifyPhoneSchema = z.object({
  phone: z.string(),
  otp: z.string().length(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>; 