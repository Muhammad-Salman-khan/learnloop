import { z } from "zod";

import {
  ANNOUNCEMENT_TARGETS,
} from "@/lib/admin/admin-data";

const targetEnum = z.enum(
  ANNOUNCEMENT_TARGETS as unknown as [string, ...string[]],
);

export const announcementSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(120, "Title is too long"),
  body: z
    .string()
    .min(10, "Body must be at least 10 characters")
    .max(2000, "Body is too long"),
  target: targetEnum,
  pinned: z.boolean(),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
