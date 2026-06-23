// Per-page editorial copy for the Smart Hub placeholder routes.
// Centralised here so layout, breadcrumb, and any future inbox previews
// read the same wording without drift.

type PlaceholderItem = {
  readonly title: string;
  readonly detail: string;
};

export type PlaceholderSpec = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly items: ReadonlyArray<PlaceholderItem>;
};

export const placeholderSpecs: Readonly<Record<string, PlaceholderSpec>> = {
  courses: {
    eyebrow: "Workspace",
    title: "My courses",
    description:
      "Every course you are enrolled in this term, with progress, grade, and quick access to lectures, materials, and discussion.",
    items: [
      {
        title: "Course list with filters",
        detail: "Filter by term, status, or instructor. Pin favourite courses to the top.",
      },
      {
        title: "Course detail page",
        detail: "Tabs for Overview, Lectures, Assignments, Grades, and Discussions.",
      },
      {
        title: "Material viewer",
        detail: "Read PDFs and watch lecture recordings inside LearnHub, no external links.",
      },
      {
        title: "Bulk actions",
        detail: "Mark complete, request extension, or download the entire course bundle.",
      },
    ],
  },
  schedule: {
    eyebrow: "Workspace",
    title: "Schedule",
    description:
      "Your weekly timetable, deadlines, and live sessions in one place. Switch between term and weekly view, and sync to your calendar.",
    items: [
      {
        title: "Weekly timetable grid",
        detail: "Day-by-hour grid showing every class and live session for the active term.",
      },
      {
        title: "Deadline list",
        detail: "Sorted list of upcoming assignments, quizzes, and exam windows, with countdown.",
      },
      {
        title: "Calendar export",
        detail: "One-click subscribe via iCal or Google Calendar so deadlines show up on your phone.",
      },
      {
        title: "Conflict warnings",
        detail: "Highlight overlapping live sessions or assignments due inside the same hour.",
      },
    ],
  },
  grades: {
    eyebrow: "Workspace",
    title: "Grades",
    description:
      "Per-course grade breakdowns, term GPA, and the long view across all your terms. Designed for serious review, not sparkle.",
    items: [
      {
        title: "Term overview card",
        detail: "Aggregate GPA, credit hours, and standing, with a small sparkline per term.",
      },
      {
        title: "Course breakdown",
        detail: "Weighted assignment scores, attendance impact, and an estimated final grade.",
      },
      {
        title: "Historical trend",
        detail: "All terms side-by-side so you can see the slope of your academic record.",
      },
      {
        title: "PDF transcript request",
        detail: "Submit an official or unofficial transcript request that flows to the registrar.",
      },
    ],
  },
  messages: {
    eyebrow: "Workspace",
    title: "Messages",
    description:
      "Direct messages with instructors and group threads for each course. Threads stay scoped to the course so context never leaks.",
    items: [
      {
        title: "Inbox",
        detail: "Unread threads pinned to the top, with course code and last activity date.",
      },
      {
        title: "Course threads",
        detail: "Each enrolled course gets a shared thread for cohort questions and announcements.",
      },
      {
        title: "Compose",
        detail: "Send to a single instructor, a course cohort, or the registrar office.",
      },
      {
        title: "Read receipts and search",
        detail: "See who has read your message, and search across all your conversations.",
      },
    ],
  },
  "ai-tools": {
    eyebrow: "Tools",
    title: "AI study tools",
    description:
      "Built-in assistants for summarising lectures, drafting outlines, and explaining concepts, all scoped to your enrolled course material.",
    items: [
      {
        title: "Lecture summariser",
        detail: "Generate a structured summary from any lecture transcript or PDF uploaded.",
      },
      {
        title: "Concept explainer",
        detail: "Ask follow-up questions on a slide and get an answer grounded in your course textbook.",
      },
      {
        title: "Study planner",
        detail: "Turn this week's deadlines into a day-by-day study plan with realistic time budgets.",
      },
      {
        title: "Citation helper",
        detail: "Auto-format citations for any source used in essays, APA, MLA, or Chicago.",
      },
    ],
  },
  settings: {
    eyebrow: "Tools",
    title: "Settings",
    description:
      "Manage your profile, notification preferences, theme, accessibility, and connected accounts.",
    items: [
      {
        title: "Profile",
        detail: "Name, avatar, contact details, and which fields other students can see.",
      },
      {
        title: "Notifications",
        detail: "Granular toggles for assignments, messages, announcements, and reminders.",
      },
      {
        title: "Appearance",
        detail: "Light, dark, or system. Font scale and reduced motion.",
      },
      {
        title: "Security",
        detail: "Change password, two-factor authentication, active sessions, and account export.",
      },
    ],
  },
  profile: {
    eyebrow: "Account",
    title: "Student profile",
    description:
      "Your public profile as seen by instructors and cohort peers. Edit your bio, contact details, and privacy preferences.",
    items: [
      {
        title: "Identity card",
        detail: "Name, student ID, programme, photo, and a one-line bio.",
      },
      {
        title: "Cohort directory listing",
        detail: "Decide whether you appear in the cohort directory and what is shown.",
      },
      {
        title: "Contact preferences",
        detail: "Choose how instructors can reach you between messages, email, and SMS.",
      },
      {
        title: "Activity privacy",
        detail: "Hide your activity feed from classmates while keeping instructor view intact.",
      },
    ],
  },
};
