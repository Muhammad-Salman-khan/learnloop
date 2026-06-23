import type { AuthSession } from "@/lib/settings/security-schema";
import type {
  AppearanceFormValues,
} from "@/lib/settings/appearance-schema";
import type { NotificationsFormValues } from "@/lib/settings/notifications-schema";
import type { ProfileFormValues } from "@/lib/settings/profile-schema";

// Demo initial values for the Settings tabs. Identical on every render
// because we deliberately have no persistence layer yet.
export const profileDefaults: ProfileFormValues = {
  firstName: "Salman",
  lastName: "Khan",
  preferredName: "Sal",
  email: "alibinkhan465@gmail.com",
  studentId: "SMIT-2024-0016-231",
  bio:
    "Fullstack dev in cohort 16. Building LearnHub as a real-world production capstone.",
  phone: "+92 327 3847728",
  programme: "Diploma in Web and Application Development",
  yearOfStudy: 2,
  avatarUrl: "",
};

export const notificationsDefaults: NotificationsFormValues = {
  assignments: { email: true, push: true, sms: false },
  messages: { email: true, push: false, sms: false },
  announcements: { email: false, push: false, sms: false },
  reminders: { email: true, push: true, sms: true },
};

export const appearanceDefaults: AppearanceFormValues = {
  theme: "system",
  fontScale: 100,
  reducedMotion: false,
  density: "default",
};

export const authSessions: ReadonlyArray<AuthSession> = [
  {
    id: "s-001",
    deviceLabel: "MacBook Pro 14",
    location: "Karachi, Pakistan",
    lastActiveAt: "Active now",
    current: true,
  },
  {
    id: "s-002",
    deviceLabel: "iPhone 15",
    location: "Karachi, Pakistan",
    lastActiveAt: "12 minutes ago",
    current: false,
  },
  {
    id: "s-003",
    deviceLabel: "Chrome on Windows",
    location: "Islamabad, Pakistan",
    lastActiveAt: "3 days ago",
    current: false,
  },
];
