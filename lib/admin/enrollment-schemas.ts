import { z } from "zod";

// Manual enrollment schema. Both student and course are required and the
// strings are typed concrete so TanStack Form's `$strip` input shape
// matches the defaultValues without needing `$strip` rewrites.
export const enrollmentSchema = z.object({
  studentId: z.string().min(1, "Select a student"),
  courseId: z.string().min(1, "Select a course"),
  notes: z.string(),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;
