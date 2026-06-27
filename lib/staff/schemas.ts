// Zod schemas for /dashboard/staff/* forms.
//
// Every form component under the staff module imports from this file.
// Mirrors the admin schemas in shape (TanStack Form expects a concrete
// `$strip` input type, so every field stays `string | boolean`-shaped
// even though some are semantically nullable).

import { z } from "zod";

import { ALL_ROLES } from "@/lib/admin/admin-data";
import {
  ALERT_SEVERITIES,
  RESULT_KINDS,
  SCHEDULE_WEEKDAYS,
  type AlertAudience,
} from "@/lib/staff/staff-data";

// All enums used inside TanStack Form validators: typed as enum to
// preserve string literal union shapes, but with a `string[]` runtime
// cast so the Standard Schema adapter accepts them.
const roleEnum = z.enum(ALL_ROLES as unknown as [string, ...string[]]);
const weekdayEnum = z.enum(SCHEDULE_WEEKDAYS as unknown as [string, ...string[]]);
const severityEnum = z.enum(ALERT_SEVERITIES as unknown as [string, ...string[]]);
const resultKindEnum = z.enum(RESULT_KINDS as unknown as [string, ...string[]]);

// ============================================================
// Add Student
// ============================================================

export const studentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Temporary password must be at least 8 characters")
    .max(64, "Temporary password is too long"),
  batch: z.string().min(1, "Select a batch"),
  className: z.string().min(1, "Class name is required"),
  section: z.string().min(1, "Section is required"),
  fatherName: z.string().min(1, "Father name is required"),
  motherName: z.string().min(1, "Mother name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  parentPhone: z.string().min(7, "Parent phone is required"),
  address: z.string().min(1, "Address is required"),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;

// ============================================================
// Edit Student  (profile-only — no email/password)
// ============================================================

export const editStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  className: z.string().min(1, "Class name is required"),
  section: z.string().min(1, "Section is required"),
  fatherName: z.string().min(1, "Father name is required"),
  motherName: z.string().min(1, "Mother name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  parentPhone: z.string().min(7, "Parent phone is required"),
  address: z.string().min(1, "Address is required"),
});

export type EditStudentValues = z.infer<typeof editStudentSchema>;

// ============================================================
// Add Teacher
// ============================================================

export const teacherFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  nic: z.string().min(5, "NIC is required"),
  qualification: z.string().min(2, "Qualification is required"),
  phoneNumber: z.string().min(7, "Phone is required"),
  subjectSpecialization: z
    .string()
    .min(2, "Add at least one subject (comma-separated)"),
  bio: z.string(),
  address: z.string(),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;

// ============================================================
// Edit Teacher
// ============================================================

export const editTeacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  nic: z.string().min(5, "NIC is required"),
  phoneNumber: z.string().min(7, "Phone is required"),
  qualification: z.string().min(2, "Qualification is required"),
  subjectSpecialization: z.string().min(2, "Add at least one subject"),
  bio: z.string(),
  address: z.string(),
  isActive: z.boolean(),
});

export type EditTeacherValues = z.infer<typeof editTeacherSchema>;

// ============================================================
// Role switch   (student↔teacher promote / demote)
// ============================================================

export const roleSwitchSchema = z.object({
  role: roleEnum,
});

export type RoleSwitchValues = z.infer<typeof roleSwitchSchema>;

// ============================================================
// Schedule entry
// ============================================================

export const scheduleEntrySchema = z.object({
  courseId: z.string().min(1, "Select a course"),
  teacherUserId: z.string().min(1, "Select a teacher"),
  day: weekdayEnum,
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  room: z.string().min(1, "Room is required"),
  recurrence: z.enum(["weekly", "biweekly", "one-off"]),
  notes: z.string(),
});

export type ScheduleEntryFormValues = z.infer<typeof scheduleEntrySchema>;

// ============================================================
// Manual enrollment
// ============================================================

export const manualEnrollmentSchema = z.object({
  studentUserId: z.string().min(1, "Select a student"),
  courseId: z.string().min(1, "Select a course"),
  notes: z.string(),
});

export type ManualEnrollmentValues = z.infer<typeof manualEnrollmentSchema>;

// ============================================================
// Fee status update  (single student)
// ============================================================

export const feeStatusUpdateSchema = z.object({
  status: z.enum(["paid", "due", "unpaid"]),
  amount: z.string(),
  reason: z.string(),
});

export type FeeStatusUpdateValues = z.infer<typeof feeStatusUpdateSchema>;

// ============================================================
// Notification  (new alert)
// ============================================================

export const notificationSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(120, "Title is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
  severity: severityEnum,
  audience: z.enum(["all", "students", "teachers", "staff", "batch"]),
  batchName: z.string(),
});

export type NotificationFormValues = z.infer<typeof notificationSchema>;

// ============================================================
// Result grid  (single row scored by staff)
// ============================================================

export const resultEntrySchema = z.object({
  studentUserId: z.string().min(1, "Select a student"),
  courseId: z.string().min(1, "Select a course"),
  title: z.string().min(2, "Title required"),
  kind: resultKindEnum,
  score: z.string(),
  maxScore: z.string(),
});

export type ResultEntryValues = z.infer<typeof resultEntrySchema>;

// ============================================================
// Export results form (course + date range)
// ============================================================

export const resultsExportSchema = z.object({
  courseId: z.string(),
  fromMonth: z.string(),
  toMonth: z.string(),
  format: z.enum(["csv", "pdf"]),
});

export type ResultsExportValues = z.infer<typeof resultsExportSchema>;

// ============================================================
// Helpers used by forms that share the role/severity enums
// ============================================================

export function describeAudience(alert: NotificationFormValues): AlertAudience {
  if (alert.audience === "batch") {
    return { kind: "batch", batchName: alert.batchName || "Unnamed batch" };
  }
  return alert.audience;
}
