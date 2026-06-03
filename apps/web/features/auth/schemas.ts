import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(3, "Enter your email or nickname"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  nickname: z.string().min(3, "Nickname must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  birthDate: z.string().min(1, "Choose your birth date"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Enter a valid email"),
  code: z.string().length(6, "Enter the 6-digit code"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    code: z.string().length(6, "Enter the 6-digit code"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data: { newPassword: string; confirmPassword: string }) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
