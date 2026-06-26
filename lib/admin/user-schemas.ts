import { z } from "zod";

import { ALL_ROLES } from "@/lib/admin/admin-data";

// Shared schemas used by admin user lifecycle forms.
// Fields are typed as if every input is required-and-string at the form
// boundary, because TanStack Form's `$strip` input type expects concrete
// values for every key. `phone` / `banReason` set "" to mean "empty";
// we coerce that to null/optional surface semantics in the page layer.
const roleEnum = z.enum(
  ALL_ROLES as unknown as [string, ...string[]],
);

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: roleEnum,
  phone: z.string(),
  sendInvite: z.boolean(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: z.enum(
    ALL_ROLES as unknown as [string, ...string[]],
  ),
  banned: z.boolean(),
  banReason: z.string(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
