import { z } from "zod";

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

// Donation Form Schema
export const donationFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number")
    .optional()
    .or(z.literal("")),
  panNumber: z
    .string()
    .trim()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number (e.g., ABCDE1234F)")
    .optional()
    .or(z.literal("")),
  amount: z
    .number()
    .min(100, "Minimum donation amount is ₹100")
    .max(10000000, "Maximum donation amount is ₹1,00,00,000"),
});

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
});

// Search Query Schema (for sanitizing search inputs)
export const searchQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .max(200, "Search query too long")
    .transform((val) => val.replace(/[<>]/g, "")), // Strip potential HTML
});

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type DonationFormData = z.infer<typeof donationFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
