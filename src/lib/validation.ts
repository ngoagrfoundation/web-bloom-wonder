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
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number")
    .optional()
    .or(z.literal("")),
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

// Volunteer Form Schema
export const volunteerFormSchema = z.object({
  fullName: z
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
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(200, "Location must be less than 200 characters"),
  initiatives: z
    .array(z.string())
    .min(1, "Please select at least one initiative"),
  availability: z
    .array(z.string())
    .min(1, "Please select at least one availability option"),
  experience: z
    .string()
    .trim()
    .max(1000, "Experience must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

// Partner Form Schema
export const partnerFormSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters")
    .max(200, "Organization name must be less than 200 characters"),
  contactPerson: z
    .string()
    .trim()
    .min(2, "Contact person name must be at least 2 characters")
    .max(100, "Contact person name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  organizationType: z
    .string()
    .min(1, "Please select an organization type"),
  partnershipInterest: z
    .array(z.string())
    .min(1, "Please select at least one partnership interest"),
  message: z
    .string()
    .trim()
    .max(1000, "Message must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

// Report Challenge Form Schema
export const reportChallengeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(200, "Location must be less than 200 characters"),
  challengeType: z
    .string()
    .min(1, "Please select a challenge type"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  peopleAffected: z
    .string()
    .optional()
    .or(z.literal("")),
});

// Adopt Student Form Schema
export const adoptStudentFormSchema = z.object({
  sponsorName: z
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
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters"),
  gradeLevel: z
    .string()
    .min(1, "Please select a grade level"),
  duration: z
    .string()
    .min(1, "Please select sponsorship duration"),
  message: z
    .string()
    .trim()
    .max(1000, "Message must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type DonationFormData = z.infer<typeof donationFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
export type VolunteerFormData = z.infer<typeof volunteerFormSchema>;
export type PartnerFormData = z.infer<typeof partnerFormSchema>;
export type ReportChallengeFormData = z.infer<typeof reportChallengeFormSchema>;
export type AdoptStudentFormData = z.infer<typeof adoptStudentFormSchema>;
