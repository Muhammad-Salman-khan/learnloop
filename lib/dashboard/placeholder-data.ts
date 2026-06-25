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
  // ------------------------------------------------------------------
  // Teacher workspace — separate namespace so the existing student
  // entries above stay untouched. The page lookup prepends "teacher-"
  // to the key on the teacher side.
  // ------------------------------------------------------------------
  "teacher-quizzes": {
    eyebrow: "Workspace",
    title: "Quizzes",
    description:
      "Author, schedule, and grade quizzes across every course you teach. Built for both formative weekly checks and summative midterms, with section-level analytics.",
    items: [
      {
        title: "Quiz library",
        detail: "All quizzes you have authored, grouped by course, with status (draft, scheduled, closed) and last edit date.",
      },
      {
        title: "Authoring studio",
        detail: "Compose MCQ, true/false, and short-answer blocks, attach source pages from course material, and set difficulty mix.",
      },
      {
        title: "Schedule and windows",
        detail: "Pick an open/close window per cohort, set retake rules, and lock the quiz once the window has started.",
      },
      {
        title: "Cohort analytics",
        detail: "Per-question difficulty and discrimination, time spent, and a list of students who need follow-up support.",
      },
    ],
  },
  "teacher-schedule": {
    eyebrow: "Workspace",
    title: "Schedule",
    description:
      "Your teaching week: live lectures, office hours, lab slots, and invigilation duty. Switch between term and weekly view, and slot new sessions without conflicting with existing ones.",
    items: [
      {
        title: "Weekly timetable",
        detail: "Day-by-hour grid showing every class, lab, and tutorial you teach this term, with room and cohort.",
      },
      {
        title: "Office hours",
        detail: "Recurring slots students can book, with an intake form so you know what they want to discuss in advance.",
      },
      {
        title: "Conflict warnings",
        detail: "Flag overlapping sessions, room double-bookings, and invigilation duty that collides with a lecture.",
      },
      {
        title: "Calendar export",
        detail: "One-click iCal or Google Calendar subscribe so your teaching week follows you to phone and laptop.",
      },
    ],
  },
  "teacher-ai-tools": {
    eyebrow: "Tools",
    title: "AI teaching tools",
    description:
      "Course-aware assistants for drafting quizzes, summarising submissions, and explaining weak concepts. Every tool is scoped to material inside your own courses, never the open web.",
    items: [
      {
        title: "Quiz generator",
        detail: "Generate MCQ, true/false, and short-answer blocks from any PDF or lecture transcript already attached to a course.",
      },
      {
        title: "Submission summariser",
        detail: "Cluster a cohort's open-text submissions into themes with cited quotes, so patterns surface without reading 200 files.",
      },
      {
        title: "Concept explainer",
        detail: "Draft a clearer explanation of any slide, grounded in your own lecture notes and the textbook sections you assigned.",
      },
      {
        title: "Rubric drafter",
        detail: "Turn a one-line assignment prompt into a weighted rubric with level descriptors, ready to publish with the assignment.",
      },
    ],
  },
  "teacher-notifications": {
    eyebrow: "Workspace",
    title: "Notifications",
    description:
      "Everything that needs your attention: late submissions, messages from students, quiz windows closing, and grading queue reminders. Configurable per channel and per priority.",
    items: [
      {
        title: "Inbox",
        detail: "Unread items pinned to the top, with course code, sender, and the action they are waiting on.",
      },
      {
        title: "Channel routing",
        detail: "Route each notification class to in-app, email, or SMS, with quiet hours so evenings stay quiet.",
      },
      {
        title: "Priority rules",
        detail: "Lift urgent items (late submissions, system alerts) above low-priority announcements and digest the rest.",
      },
      {
        title: "Bulk resolve",
        detail: "Mark all read, archive by course, or mute a thread for a week without losing the underlying record.",
      },
    ],
  },
  "teacher-profile": {
    eyebrow: "Account",
    title: "Teacher profile",
    description:
      "Your public profile as seen by students and the school directory. Edit your bio, office hours, contact channels, and which fields students can see.",
    items: [
      {
        title: "Identity card",
        detail: "Name, title, department, photo, and a one-line teaching philosophy.",
      },
      {
        title: "Office hours and room",
        detail: "Recurring weekly slots with room number, plus a standing note on how students should book.",
      },
      {
        title: "Courses taught",
        detail: "Auto-listed from your active courses with a toggle for which ones show on your public profile.",
      },
      {
        title: "Contact preferences",
        detail: "Decide how students can reach you — messages, email, or both — and which fields appear in the directory.",
      },
    ],
  },
};
