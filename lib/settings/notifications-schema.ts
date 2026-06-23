import * as z from "zod";

// One channel = one boolean. Four event categories x three channels = 12 toggles.
// Channels model delivery mechanism, not severity; "quiet" categories use none.
export const notificationEvents = [
  "assignments",
  "messages",
  "announcements",
  "reminders",
] as const;
export type NotificationEvent = (typeof notificationEvents)[number];

export const notificationChannels = ["email", "push", "sms"] as const;
export type NotificationChannel = (typeof notificationChannels)[number];

export const notificationChannelLabels: Record<NotificationChannel, string> = {
  email: "Email",
  push: "Push",
  sms: "SMS",
};

export const notificationEventLabels: Record<NotificationEvent, string> = {
  assignments: "Assignment updates",
  messages: "Direct messages",
  announcements: "Announcements",
  reminders: "Deadline reminders",
};

const channelRow = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
});

export const notificationsSchema = z.object({
  assignments: channelRow,
  messages: channelRow,
  announcements: channelRow,
  reminders: channelRow,
});

export type NotificationsFormValues = z.infer<typeof notificationsSchema>;

export type ChannelMap = Record<NotificationChannel, boolean>;
export type NotificationGrid = Record<NotificationEvent, ChannelMap>;
