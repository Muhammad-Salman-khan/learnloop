import { z } from "zod";

// Schema for the "Create course" page.
// Mounted as `onChange` validator on the TanStack Form.
export const newCourseSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters (e.g. TS-301).")
    .max(16, "Code must be 16 characters or fewer.")
    .regex(/^[A-Z]{2,4}-\d{2,4}$/, "Use the format DEPT-NNN, e.g. TS-301."),
  title: z
    .string()
    .min(4, "Title must be at least 4 characters.")
    .max(80, "Title must be 80 characters or fewer."),
  subtitle: z
    .string()
    .min(8, "Subtitle must be at least 8 characters.")
    .max(140, "Subtitle must be 140 characters or fewer."),
  status: z.enum(["draft", "live", "archived"]),
  feePerSeat: z
    .string()
    .min(2, "Enter a fee (use $0 for free).")
    .max(20, "Fee is too long."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(800, "Description must be 800 characters or fewer."),
  seats: z
    .number({ message: "Enter the maximum seats." })
    .int("Seats must be a whole number.")
    .min(1, "At least one seat.")
    .max(500, "500 or fewer seats."),
  notifyOnSubmission: z.boolean(),
});

export type NewCourseFormValues = z.infer<typeof newCourseSchema>;

export const newCourseDefaults: NewCourseFormValues = {
  code: "",
  title: "",
  subtitle: "",
  status: "draft",
  feePerSeat: "$0",
  description: "",
  seats: 30,
  notifyOnSubmission: true,
};
