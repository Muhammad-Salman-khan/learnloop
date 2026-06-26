import { z } from "zod";

// Mirror of lib/admin/admin-data.ts → platformSettings. Fields are
// required to keep TanStack Form's `$strip` input shape aligned with the
// form's defaultValues.
export const platformSettingsSchema = z.object({
  platformName: z.string().min(2, "Name must be at least 2 characters"),
  academicYear: z.string().min(4, "Enter a year range, e.g. 2025-2026"),
  contactEmail: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  defaultLanguage: z.enum(["en", "ur"]),
  maintenanceMode: z.boolean(),
  allowSelfSignup: z.boolean(),
  maxCourseCapacity: z
    .number({ message: "Must be a positive number" })
    .int("Must be a whole number")
    .min(1, "Capacity cannot be below 1")
    .max(1000, "Capacity is unrealistic"),
});

export type PlatformSettingsFormValues = z.infer<
  typeof platformSettingsSchema
>;
