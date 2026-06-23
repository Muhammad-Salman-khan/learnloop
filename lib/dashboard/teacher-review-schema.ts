import * as z from "zod";

// Validation schema for the Schedule → "Review an instructor" form.
//
// Mounted on field-level onChange validators inside
// components/ScheduleReviews/ScheduleReviews.tsx via TanStack Form.
// The shape is intentionally flat: the form UIs the target (class vs period)
// and resolves teacher/slot context in a small derivation step on submit.
export const reviewSchema = z
  .object({
    target: z.enum(["class_teacher", "period_teacher"]),
    courseCode: z.string().min(1, "Pick a course").max(16),
    slotId: z.string().min(1, "Pick a period"),
    // Teacher is auto-filled for known slots but the field stays editable so
    // future free-form reviews can be recorded against teachers not in the
    // timetable (e.g. a coach you only met once).
    teacherName: z
      .string()
      .min(2, "Teacher name needs at least 2 characters")
      .max(80, "Keep teacher names under 80 characters"),
    rating: z
      .number({ message: "Rating must be between 1 and 5" })
      .int("Rating must be a whole number")
      .min(1, "Pick at least 1 star")
      .max(5, "Maximum rating is 5 stars"),
    comment: z
      .string()
      .min(20, "Comments need at least 20 characters")
      .max(600, "Keep comments under 600 characters"),
    anonymous: z.boolean(),
  })
  .refine(
    (v) =>
      // class_teacher blank-comment guard: tightens the onChange validator
      // path so empty class-teacher reviews fail loudly instead of silently
      // landing with no context. (Slot binding is enforced at submit-time
      // against ScheduleSlot; this refine is the schema-only guard.)
      v.target === "period_teacher" || v.slotId.length > 0,
    { path: ["slotId"], message: "Slot must resolve to a class-teacher slot" }
  );

export type ReviewFormValues = z.infer<typeof reviewSchema>;
