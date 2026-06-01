import { z } from "zod";

const kenyanPhoneRegex = /^(\+254|254|0)?[17]\d{8}$/;

export const checkoutSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(10, "Enter a valid Kenyan phone number")
    .regex(kenyanPhoneRegex, "Use format +254 7XX XXX XXX"),
  email: z.string().email("Enter a valid email address"),
  address: z.string().min(5, "Enter your delivery address"),
  county: z.string().min(1, "Select your county"),
  deliveryType: z.enum(["same-day", "standard"]),
  giftMessage: z.string().max(200, "Message must be 200 characters or less").optional(),
  paymentMethod: z.enum(["mpesa", "card"]),
  acceptPolicies: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms and Privacy Policy to place an order",
  }),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;

export const trackOrderSchema = z.object({
  orderNumber: z.string().min(4, "Enter your order number"),
  phone: z
    .string()
    .min(10, "Enter the phone used for the order")
    .regex(kenyanPhoneRegex, "Use format +254 7XX XXX XXX"),
});

export type TrackOrderSchema = z.infer<typeof trackOrderSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Enter a valid email address"),
    phone: z
      .string()
      .min(10, "Enter a valid Kenyan phone number")
      .regex(kenyanPhoneRegex, "Use format +254 7XX XXX XXX"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the Terms and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}
