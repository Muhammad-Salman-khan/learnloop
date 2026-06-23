import * as z from "zod";

export const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontScale: z.number().int().min(85).max(125),
  reducedMotion: z.boolean(),
  density: z.enum(["compact", "default", "comfortable"]),
});

export type AppearanceFormValues = z.infer<typeof appearanceSchema>;
