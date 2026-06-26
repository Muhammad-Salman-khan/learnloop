import { z } from 'zod';

export const accountSettingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string(),
  timezone: z.string().min(1, 'Select a timezone'),
});

export type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>;
