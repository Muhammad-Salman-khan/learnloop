import * as z from "zod";

// Profile tab schema. Email and student ID are intentionally write-locked
// at the UI layer (not in the schema) since they flow from auth/registrar.
export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  preferredName: z.string().max(80).optional().or(z.literal("")),
  email: z.string().email(),
  studentId: z.string(),
  bio: z.string().max(280, "Bio must be 280 characters or fewer"),
  phone: z
    .string()
    .max(20)
    .regex(/^[+0-9 ()-]*$/, "Use digits, spaces, +, - and parentheses only")
    .optional()
    .or(z.literal("")),
  programme: z.string(),
  yearOfStudy: z.number().int().min(1).max(8),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
