import type { CourseStatus } from "@/lib/admin/admin-data";

// Helpers used by forms and tables that don't warrant a dedicated schema
// file. Keep them tiny — no validation, no defaults.
export const ALL_STATUSES: ReadonlyArray<CourseStatus> = [
  "draft",
  "live",
  "archived",
];
