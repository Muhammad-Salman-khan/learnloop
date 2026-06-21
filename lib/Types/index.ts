import { z } from "zod";

export const CloudinaryUploadSchema = z.object({
  public_id: z.string(),
  key: z.string(),
});

export type CloudinaryUploadType = z.infer<typeof CloudinaryUploadSchema>;
