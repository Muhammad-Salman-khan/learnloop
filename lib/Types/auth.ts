import * as z from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }),
  password: z
    .string()
    .min(1, { error: "Password is required." })
    .max(128, { error: "Password is too long." }),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Server-facing payload (no client-only "confirmPassword").
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(80, { error: "Name must be at most 80 characters." })
    .trim(),
  email: z.email({ error: "Enter a valid email address." }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .max(128, { error: "Password must be at most 128 characters." })
    .regex(/[a-z]/, { error: "Include at least one lowercase letter." })
    .regex(/[A-Z]/, { error: "Include at least one uppercase letter." })
    .regex(/[0-9]/, { error: "Include at least one number." }),
});

export type SignupInput = z.infer<typeof signupSchema>;

// Client form values: adds password-match refinement + terms checkbox.
export const signupFormSchema = signupSchema
  .extend({
    confirmPassword: z.string().min(1, { error: "Confirm your password." }),
    terms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupFormSchema>;

export type AuthFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
};
