import { z } from "zod";
import { isPasswordValid } from "./validation";

const email = z.string().trim().min(1, "Enter your email.").pipe(z.email("Enter a valid email address."));

const newPassword = z.string().refine(isPasswordValid, "Choose a password that meets all the requirements.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
  remember: z
    .string()
    .optional()
    .transform((value) => value === "on"),
});

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email,
  password: newPassword,
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string(),
  })
  .refine((values) => values.confirmPassword === values.password, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const backupCodeSchema = z.object({
  backupCode: z.string().trim().min(1, "Enter a backup code."),
});

export const renameBoardSchema = z.object({
  name: z.string().trim().min(1, "Enter a board name.").max(80, "Keep the name under 80 characters."),
});

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(2, "Use at least 2 characters.").max(40, "Keep the name under 40 characters."),
});

export const folderSchema = z.object({
  name: z.string().trim().min(1, "Enter a folder name.").max(60, "Keep the name under 60 characters."),
});

export function isValidEmail(value: string) {
  return z.email().safeParse(value).success;
}

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(60, "Keep your name under 60 characters."),
});

export const changeEmailSchema = z.object({
  email,
  password: z.string().min(1, "Enter your current password."),
});
