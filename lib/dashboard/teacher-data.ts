// Static demo data for the teacher dashboard.
// One typed module so every Server Component page under /dashboard/teacher/*
// can read it without touching the DB (real models land later).
// All "demo" labels in UI copy guard against mistaking this for live data.

// ---------- Overview / KPIs ----------

export type TeacherKpi = {
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
  readonly trend?: "up" | "down" | "flat";
  readonly hint?: string;
};

// ---------- Course catalogue ----------

export type CourseStatus = "draft" | "live" | "archived";

export type TeacherCourse = {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly subtitle: string;
  readonly status: CourseStatus;
  readonly students: number;
  readonly modules: number;
  readonly materials: number;
  readonly assignments: number;
  readonly quizzes: number;
  readonly progressPct: number; // avg roadmap completion across enrolled students
  readonly updatedAt: string;
  readonly feePerSeat: string;
};

// ---------- Roadmap (curriculum) ----------

export type RoadmapModule = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly lessons: number;
  readonly minutes: number;
};

// ---------- Materials ----------

export type MaterialKind = "pdf" | "video" | "doc" | "link";

export type TeacherMaterial = {
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  readonly kind: MaterialKind;
  readonly sizeKb: number;
  readonly uploadedAt: string;
  readonly chunks: number;
  readonly summary: string;
};

export type PdfChatTurn = {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly content: string;
  readonly citations?: ReadonlyArray<{ page: number; quote: string }>;
};

export type PdfQuizGen = {
  readonly id: string;
  readonly title: string;
  readonly mcqCount: number;
  readonly trueFalseCount: number;
  readonly shortAnswerCount: number;
  readonly difficulty: "easy" | "medium" | "hard";
  readonly generatedAt: string;
};

// ---------- Students ----------

export type FeeStatus = "paid" | "pending" | "overdue" | "scholarship";

export type EnrolledStudent = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly enrollmentDate: string;
  readonly roadmapPct: number;
  readonly feeStatus: FeeStatus;
  readonly lastActive: string;
  readonly initials: string;
};

// ---------- Assignments ----------

export type AssignmentStatus = "draft" | "open" | "closed";

export type TeacherAssignment = {
  readonly id: string;
  readonly courseId: string;
  readonly courseCode: string;
  readonly title: string;
  readonly description: string;
  readonly status: AssignmentStatus;
  readonly dueAt: string;
  readonly totalMarks: number;
  readonly submitted: number;
  readonly graded: number;
  readonly totalStudents: number;
  readonly type: "homework" | "lab" | "project" | "reading";
};

export type SubmissionStatus = "pending" | "graded" | "late";

export type SubmissionRow = {
  readonly id: string;
  readonly studentId: string;
  readonly studentName: string;
  readonly initials: string;
  readonly submittedAt: string;
  readonly status: SubmissionStatus;
  readonly score: number | null; // null when not yet graded
  readonly feedback: string | null;
  readonly attachments: number;
};

// ---------- Quizzes ----------

export type TeacherQuiz = {
  readonly id: string;
  readonly courseId: string;
  readonly courseCode: string;
  readonly title: string;
  readonly questionCount: number;
  readonly attempts: number;
  readonly avgScore: number; // 0..100
  readonly status: "draft" | "published" | "archived";
  readonly durationMin: number;
  readonly updatedAt: string;
};

export type QuizResultRow = {
  readonly id: string;
  readonly studentId: string;
  readonly studentName: string;
  readonly initials: string;
  readonly attemptedAt: string;
  readonly score: number; // 0..100
  readonly correct: number;
  readonly total: number;
  readonly timeSpentSec: number;
  readonly sectionBreakdown: ReadonlyArray<{ section: string; score: number }>;
};

// ---------- Profile ----------

export type TeacherProfile = {
  readonly name: string;
  readonly headline: string;
  readonly email: string;
  readonly phone: string;
  readonly location: string;
  readonly timezone: string;
  readonly initials: string;
  readonly bio: string;
  readonly subjects: ReadonlyArray<string>;
  readonly yearsTeaching: number;
  readonly totalLearners: number;
};

// =====================================================================
// DEMO DATA
// =====================================================================

const today = new Date("2026-06-25T09:00:00Z");

function isoDaysAgo(days: number): string {
  const d = new Date(today.getTime() - days * 86_400_000);
  return d.toISOString();
}

function isoDaysAhead(days: number): string {
  const d = new Date(today.getTime() + days * 86_400_000);
  return d.toISOString();
}

export const teacherKpis: ReadonlyArray<TeacherKpi> = [
  {
    label: "Active courses",
    value: "6",
    delta: "+1 this term",
    trend: "up",
    hint: "Across 4 departments",
  },
  {
    label: "Enrolled students",
    value: "184",
    delta: "+12 vs last week",
    trend: "up",
    hint: "Cohort 12 of 16",
  },
  {
    label: "Pending to grade",
    value: "23",
    delta: "−4 since Monday",
    trend: "down",
    hint: "8 due in next 48h",
  },
  {
    label: "Avg. quiz score",
    value: "78%",
    delta: "+2.1 pts",
    trend: "up",
    hint: "Across 11 quizzes",
  },
];

export const teacherProfile: TeacherProfile = {
  name: "Salman Khan",
  headline: "Senior Lecturer  -  Web & App Development",
  email: "salman.khan@learnhub.io",
  phone: "+92 327 384 7728",
  location: "Karachi, Pakistan",
  timezone: "PKT (UTC+05:00)",
  initials: "SK",
  bio: "Full-stack educator focused on shipping production-grade, type-safe code. Currently teaching fullstack web development to SMIT cohort 16.",
  subjects: ["TypeScript", "Next.js", "PostgreSQL", "System design", "Career coaching"],
  yearsTeaching: 7,
  totalLearners: 184,
};

// ---------- Profile (public) ----------

// Per-card data for the right-column read-only profile view. Kept separate
// from the form defaults because the public profile and the editable profile
// diverge once privacy toggles exist — public view masks hidden fields.
export type TeacherOfficeHour = {
  readonly id: string;
  readonly day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  readonly startTime: string; // "15:00"
  readonly endTime: string;
  readonly room: string;
  readonly mode: "in_person" | "live_online";
  readonly bookingNote: string;
};

export const teacherOfficeHours: ReadonlyArray<TeacherOfficeHour> = [
  {
    id: "oh-1",
    day: "Tue",
    startTime: "15:00",
    endTime: "17:00",
    room: "Room CS-212",
    mode: "in_person",
    bookingNote: "Drop in, or book a 20-minute slot via the dashboard inbox.",
  },
  {
    id: "oh-2",
    day: "Thu",
    startTime: "11:00",
    endTime: "12:00",
    room: "Room CS-212",
    mode: "live_online",
    bookingNote: "Online only. Link posted in messages 15 minutes before.",
  },
];

// ---------- Schedule (teaching week) ----------

// One row per slot in the teacher's teaching week. Mirrors the student
// ScheduleSlot shape so the existing <ScheduleTable /> can render either
// side without branching in the component.
export type TeachingSlot = {
  readonly id: string;
  readonly courseId: string;
  readonly courseCode: string;
  readonly courseTitle: string;
  readonly cohort: string;
  readonly day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  readonly startTime: string;
  readonly endTime: string;
  readonly room: string;
  readonly mode: "in_person" | "live_online" | "recorded";
  readonly kind: "lecture" | "lab" | "tutorial" | "office_hours" | "invigilation";
};

export const teachingSlots: ReadonlyArray<TeachingSlot> = [
  {
    id: "ts-01",
    courseId: "c-ts-bootcamp",
    courseCode: "TS-301",
    courseTitle: "TypeScript Bootcamp",
    cohort: "Cohort 16",
    day: "Mon",
    startTime: "09:00",
    endTime: "10:30",
    room: "Room CS-101",
    mode: "in_person",
    kind: "lecture",
  },
  {
    id: "ts-02",
    courseId: "c-next-mastery",
    courseCode: "NX-410",
    courseTitle: "Next.js Mastery",
    cohort: "Cohort 16",
    day: "Mon",
    startTime: "11:00",
    endTime: "12:30",
    room: "Room CS-204",
    mode: "in_person",
    kind: "lecture",
  },
  {
    id: "ts-03",
    courseId: "c-ts-bootcamp",
    courseCode: "TS-301",
    courseTitle: "TypeScript Bootcamp",
    cohort: "Cohort 16",
    day: "Tue",
    startTime: "09:00",
    endTime: "10:30",
    room: "Lab CS-Lab1",
    mode: "in_person",
    kind: "lab",
  },
  {
    id: "ts-04",
    courseId: "c-postgres-foundations",
    courseCode: "PG-220",
    courseTitle: "PostgreSQL Foundations",
    cohort: "Cohort 15",
    day: "Wed",
    startTime: "11:00",
    endTime: "12:30",
    room: "Room CS-301",
    mode: "live_online",
    kind: "lecture",
  },
  {
    id: "ts-05",
    courseId: "c-next-mastery",
    courseCode: "NX-410",
    courseTitle: "Next.js Mastery",
    cohort: "Cohort 16",
    day: "Wed",
    startTime: "14:00",
    endTime: "15:30",
    room: "Room CS-204",
    mode: "in_person",
    kind: "tutorial",
  },
  {
    id: "ts-06",
    courseId: "c-system-design-101",
    courseCode: "SD-101",
    courseTitle: "System Design 101",
    cohort: "Cohort 14",
    day: "Thu",
    startTime: "09:00",
    endTime: "10:30",
    room: "Room CS-401",
    mode: "recorded",
    kind: "lecture",
  },
  {
    id: "ts-07",
    courseId: "c-ts-bootcamp",
    courseCode: "TS-301",
    courseTitle: "TypeScript Bootcamp",
    cohort: "Cohort 16",
    day: "Fri",
    startTime: "10:00",
    endTime: "11:30",
    room: "Room CS-101",
    mode: "live_online",
    kind: "lecture",
  },
  {
    id: "ts-08",
    courseId: "c-postgres-foundations",
    courseCode: "PG-220",
    courseTitle: "PostgreSQL Foundations",
    cohort: "Cohort 15",
    day: "Fri",
    startTime: "14:00",
    endTime: "15:30",
    room: "Exam Hall-A",
    mode: "in_person",
    kind: "invigilation",
  },
];
export const teacherCourses: ReadonlyArray<TeacherCourse> = [
  {
    id: "c-ts-bootcamp",
    code: "TS-301",
    title: "TypeScript Bootcamp",
    subtitle: "From types to production",
    status: "live",
    students: 42,
    modules: 8,
    materials: 14,
    assignments: 6,
    quizzes: 4,
    progressPct: 62,
    updatedAt: isoDaysAgo(2),
    feePerSeat: "$129",
  },
  {
    id: "c-next-mastery",
    code: "NX-410",
    title: "Next.js Mastery",
    subtitle: "App Router, Server Components, RSC patterns",
    status: "live",
    students: 38,
    modules: 10,
    materials: 22,
    assignments: 9,
    quizzes: 5,
    progressPct: 45,
    updatedAt: isoDaysAgo(1),
    feePerSeat: "$149",
  },
  {
    id: "c-postgres-foundations",
    code: "PG-220",
    title: "PostgreSQL Foundations",
    subtitle: "Schema design, queries, performance",
    status: "live",
    students: 31,
    modules: 6,
    materials: 9,
    assignments: 5,
    quizzes: 3,
    progressPct: 71,
    updatedAt: isoDaysAgo(5),
    feePerSeat: "$99",
  },
  {
    id: "c-system-design-101",
    code: "SD-101",
    title: "System Design 101",
    subtitle: "Cache, queues, consistency",
    status: "live",
    students: 27,
    modules: 7,
    materials: 11,
    assignments: 4,
    quizzes: 2,
    progressPct: 28,
    updatedAt: isoDaysAgo(7),
    feePerSeat: "$179",
  },
  {
    id: "c-docker-primer",
    code: "DK-150",
    title: "Docker Primer",
    subtitle: "Containers, compose, deploys",
    status: "draft",
    students: 0,
    modules: 5,
    materials: 4,
    assignments: 2,
    quizzes: 1,
    progressPct: 0,
    updatedAt: isoDaysAgo(12),
    feePerSeat: "$89",
  },
  {
    id: "c-career-coaching",
    code: "CR-100",
    title: "Career Coaching",
    subtitle: "Resumes, portfolio, interviews",
    status: "archived",
    students: 46,
    modules: 4,
    materials: 7,
    assignments: 3,
    quizzes: 1,
    progressPct: 100,
    updatedAt: isoDaysAgo(90),
    feePerSeat: "$0",
  },
];

export function findCourse(courseId: string): TeacherCourse | undefined {
  return teacherCourses.find((c) => c.id === courseId);
}

// ---------- Roadmap per course ----------

export const roadmapByCourse: Record<string, ReadonlyArray<RoadmapModule>> = {
  "c-ts-bootcamp": [
    {
      id: "rm-1",
      title: "1. Type fundamentals",
      summary: "Primitives, unions, narrowing, and inference",
      lessons: 6,
      minutes: 64,
    },
    {
      id: "rm-2",
      title: "2. Generics & utility types",
      summary: "Conditional types, mapped types, infer",
      lessons: 8,
      minutes: 92,
    },
    {
      id: "rm-3",
      title: "3. Modules & declaration files",
      summary: "Module resolution, .d.ts, ambient types",
      lessons: 5,
      minutes: 48,
    },
    {
      id: "rm-4",
      title: "4. Advanced narrowing",
      summary: "Discriminated unions, branded types, asserts",
      lessons: 6,
      minutes: 70,
    },
    {
      id: "rm-5",
      title: "5. Type-level programming",
      summary: "Recursive types, template literals, parser combinators",
      lessons: 7,
      minutes: 88,
    },
    {
      id: "rm-6",
      title: "6. Production patterns",
      summary: "Zod, tRPC, type-safe boundaries",
      lessons: 6,
      minutes: 72,
    },
  ],
  "c-next-mastery": [
    {
      id: "rm-n1",
      title: "1. App Router essentials",
      summary: "Routing, layouts, parallel & intercepting routes",
      lessons: 7,
      minutes: 80,
    },
    {
      id: "rm-n2",
      title: "2. Server Components & data flow",
      summary: "RSC, Server Actions, revalidation, caching",
      lessons: 8,
      minutes: 96,
    },
    {
      id: "rm-n3",
      title: "3. UI primitives & shadcn",
      summary: "Design system, Radix, forms with TanStack",
      lessons: 6,
      minutes: 70,
    },
    {
      id: "rm-n4",
      title: "4. Mutations, auth & sessions",
      summary: "Server Actions, Better Auth, RBAC",
      lessons: 9,
      minutes: 110,
    },
    {
      id: "rm-n5",
      title: "5. Performance & React Compiler",
      summary: "Server-first, streaming, suspense",
      lessons: 5,
      minutes: 58,
    },
  ],
};

// ---------- Materials ----------

export const materialsByCourse: Record<string, ReadonlyArray<TeacherMaterial>> = {
  "c-ts-bootcamp": [
    {
      id: "m-ts-handbook",
      courseId: "c-ts-bootcamp",
      title: "TypeScript Handbook  -  Chapters 1-4.pdf",
      kind: "pdf",
      sizeKb: 2_140,
      uploadedAt: isoDaysAgo(20),
      chunks: 318,
      summary:
        "A condensed walkthrough of the TypeScript handbook covering basic types, control flow analysis, and function overloads. Useful as the first read for new TypeScript developers moving from JavaScript.",
    },
    {
      id: "m-ts-advanced-types",
      courseId: "c-ts-bootcamp",
      title: "Advanced Types  -  Conditional & Mapped.pdf",
      kind: "pdf",
      sizeKb: 1_330,
      uploadedAt: isoDaysAgo(14),
      chunks: 204,
      summary:
        "Deep dive into conditional types (extends ? :), mapped types, and the infer keyword with practical parser-builder examples.",
    },
    {
      id: "m-ts-react-cheats",
      courseId: "c-ts-bootcamp",
      title: "TypeScript + React Cheatsheet.md",
      kind: "doc",
      sizeKb: 88,
      uploadedAt: isoDaysAgo(9),
      chunks: 31,
      summary:
        "Cheatsheet for typing React 19 component props, refs, context, and event handlers in client components.",
    },
    {
      id: "m-zod-guide",
      courseId: "c-ts-bootcamp",
      title: "Zod v4 Schema Patterns.pdf",
      kind: "pdf",
      sizeKb: 690,
      uploadedAt: isoDaysAgo(3),
      chunks: 112,
      summary:
        "Patterns for composing Zod schemas, discriminated unions, and schema-driven form validation with TanStack Form.",
    },
    {
      id: "m-ts-yt",
      courseId: "c-ts-bootcamp",
      title: "Live session: Discriminated unions",
      kind: "video",
      sizeKb: 84_500,
      uploadedAt: isoDaysAgo(6),
      chunks: 0,
      summary:
        "Recording of the live session covering discriminated unions, exhaustive switches, and branding primitives.",
    },
  ],
  "c-next-mastery": [
    {
      id: "m-nx-app-router",
      courseId: "c-next-mastery",
      title: "Next.js App Router  -  Mental Model.pdf",
      kind: "pdf",
      sizeKb: 1_810,
      uploadedAt: isoDaysAgo(18),
      chunks: 244,
      summary:
        "The mental model for the Next.js App Router: layouts, route groups, parallel routes, and intercepting routes. Explains why Server Components are the default and how data flows.",
    },
    {
      id: "m-nx-rsc-data",
      courseId: "c-next-mastery",
      title: "RSC data fetching patterns.pdf",
      kind: "pdf",
      sizeKb: 1_240,
      uploadedAt: isoDaysAgo(11),
      chunks: 176,
      summary:
        "Patterns: fetch caching, revalidatePath, Server Actions, and when to opt into client islands. Includes the 4 invalidation gotchas.",
    },
    {
      id: "m-nx-tanstack-form",
      courseId: "c-next-mastery",
      title: "TanStack Form with shadcn Field primitives.pdf",
      kind: "pdf",
      sizeKb: 540,
      uploadedAt: isoDaysAgo(4),
      chunks: 78,
      summary:
        "Wiring @tanstack/react-form with zod validators (onChange/onBlur/onSubmit). Pairs with the shadcn Field family.",
    },
  ],
  "c-postgres-foundations": [
    {
      id: "m-pg-schema",
      courseId: "c-postgres-foundations",
      title: "Schema Design  -  First Normal Form → 3NF.pdf",
      kind: "pdf",
      sizeKb: 980,
      uploadedAt: isoDaysAgo(22),
      chunks: 132,
      summary:
        "Designing schemas: identifying entities, picking primary keys, and the trade-offs of normalization vs. read performance.",
    },
  ],
};

export function findMaterial(materialId: string): TeacherMaterial | undefined {
  for (const list of Object.values(materialsByCourse)) {
    const hit = list.find((m) => m.id === materialId);
    if (hit) return hit;
  }
  return undefined;
}

export const pdfChatByMaterial: Record<string, ReadonlyArray<PdfChatTurn>> = {
  "m-ts-advanced-types": [
    {
      id: "t1",
      role: "user",
      content: "What does `infer` actually do and when should I reach for it?",
    },
    {
      id: "t2",
      role: "assistant",
      content:
        "`infer` introduces a type variable inside a conditional type's `extends` branch. You reach for it when you want to extract a piece out of another type  -  like the resolved value of a Promise, or the Element type of an array. It only has meaning inside an `extends ? :` clause, not on its own.",
      citations: [
        { page: 4, quote: "infer R extends ... ? R : never" },
        { page: 7, quote: "the inferred type variable is in scope only inside the true branch" },
      ],
    },
    {
      id: "t3",
      role: "user",
      content: "Give me a real example I can paste into a parser builder.",
    },
    {
      id: "t4",
      role: "assistant",
      content:
        "Sure  -  ReturnType<typeof parser> threads the inferred output type through. Combine with Awaited<> and you have a fully-typed async parser without ever casting: `type Output<T> = T extends Parser<infer O> ? Awaited<O> : never`.",
      citations: [{ page: 12, quote: "ExtractOutput<Parser<R>> = R" }],
    },
  ],
};

export const pdfQuizzesByMaterial: Record<string, ReadonlyArray<PdfQuizGen>> = {
  "m-ts-advanced-types": [
    {
      id: "q-1",
      title: "Conditional types basics",
      mcqCount: 6,
      trueFalseCount: 4,
      shortAnswerCount: 2,
      difficulty: "medium",
      generatedAt: isoDaysAgo(2),
    },
    {
      id: "q-2",
      title: "Mapped & template literal types",
      mcqCount: 8,
      trueFalseCount: 3,
      shortAnswerCount: 3,
      difficulty: "hard",
      generatedAt: isoDaysAgo(2),
    },
  ],
  "m-nx-rsc-data": [
    {
      id: "q-nx-1",
      title: "Server Actions & revalidation",
      mcqCount: 7,
      trueFalseCount: 3,
      shortAnswerCount: 2,
      difficulty: "medium",
      generatedAt: isoDaysAgo(1),
    },
  ],
};

// ---------- Students per course ----------

export const studentsByCourse: Record<string, ReadonlyArray<EnrolledStudent>> = {
  "c-ts-bootcamp": [
    {
      id: "s-1",
      name: "Ayesha Siddiqui",
      email: "ayesha.s@example.com",
      enrollmentDate: isoDaysAgo(60),
      roadmapPct: 86,
      feeStatus: "paid",
      lastActive: isoDaysAgo(0),
      initials: "AS",
    },
    {
      id: "s-2",
      name: "Hamza Tariq",
      email: "hamza.t@example.com",
      enrollmentDate: isoDaysAgo(58),
      roadmapPct: 72,
      feeStatus: "paid",
      lastActive: isoDaysAgo(1),
      initials: "HT",
    },
    {
      id: "s-3",
      name: "Maham Javed",
      email: "maham.j@example.com",
      enrollmentDate: isoDaysAgo(55),
      roadmapPct: 64,
      feeStatus: "pending",
      lastActive: isoDaysAgo(0),
      initials: "MJ",
    },
    {
      id: "s-4",
      name: "Bilal Ashraf",
      email: "bilal.a@example.com",
      enrollmentDate: isoDaysAgo(50),
      roadmapPct: 41,
      feeStatus: "overdue",
      lastActive: isoDaysAgo(5),
      initials: "BA",
    },
    {
      id: "s-5",
      name: "Sara Naseem",
      email: "sara.n@example.com",
      enrollmentDate: isoDaysAgo(48),
      roadmapPct: 92,
      feeStatus: "scholarship",
      lastActive: isoDaysAgo(0),
      initials: "SN",
    },
    {
      id: "s-6",
      name: "Owais Iqbal",
      email: "owais.i@example.com",
      enrollmentDate: isoDaysAgo(46),
      roadmapPct: 33,
      feeStatus: "paid",
      lastActive: isoDaysAgo(2),
      initials: "OI",
    },
    {
      id: "s-7",
      name: "Fatima Rehman",
      email: "fatima.r@example.com",
      enrollmentDate: isoDaysAgo(40),
      roadmapPct: 58,
      feeStatus: "pending",
      lastActive: isoDaysAgo(1),
      initials: "FR",
    },
    {
      id: "s-8",
      name: "Zain Ali",
      email: "zain.a@example.com",
      enrollmentDate: isoDaysAgo(35),
      roadmapPct: 22,
      feeStatus: "paid",
      lastActive: isoDaysAgo(7),
      initials: "ZA",
    },
  ],
};

// ---------- Assignments ----------

export const assignmentsByCourse: Record<string, ReadonlyArray<TeacherAssignment>> = {
  "c-ts-bootcamp": [
    {
      id: "a-1",
      courseId: "c-ts-bootcamp",
      courseCode: "TS-301",
      title: "Branding primitives lab",
      description: "Implement a Branded<T, K> helper and apply it to a UserId.",
      status: "closed",
      dueAt: isoDaysAgo(10),
      totalMarks: 100,
      submitted: 40,
      graded: 40,
      totalStudents: 42,
      type: "lab",
    },
    {
      id: "a-2",
      courseId: "c-ts-bootcamp",
      courseCode: "TS-301",
      title: "Discriminated union router",
      description: "Type-safe HTTP router using discriminated unions.",
      status: "open",
      dueAt: isoDaysAhead(3),
      totalMarks: 100,
      submitted: 22,
      graded: 8,
      totalStudents: 42,
      type: "homework",
    },
    {
      id: "a-3",
      courseId: "c-ts-bootcamp",
      courseCode: "TS-301",
      title: "Project: Type-safe API client",
      description: "Build a typed fetch wrapper with retry, errors, and zod parsing.",
      status: "open",
      dueAt: isoDaysAhead(10),
      totalMarks: 200,
      submitted: 4,
      graded: 0,
      totalStudents: 42,
      type: "project",
    },
    {
      id: "a-4",
      courseId: "c-ts-bootcamp",
      courseCode: "TS-301",
      title: "Reading: Effective TypeScript (ch. 3-5)",
      description: "Read & answer reflection questions.",
      status: "open",
      dueAt: isoDaysAhead(17),
      totalMarks: 30,
      submitted: 0,
      graded: 0,
      totalStudents: 42,
      type: "reading",
    },
    {
      id: "a-5",
      courseId: "c-ts-bootcamp",
      courseCode: "TS-301",
      title: "Lab: Type-level parser combinator",
      description: "Implement 3 combinators using template-literal types.",
      status: "draft",
      dueAt: isoDaysAhead(24),
      totalMarks: 150,
      submitted: 0,
      graded: 0,
      totalStudents: 42,
      type: "lab",
    },
  ],
  "c-next-mastery": [
    {
      id: "a-nx-1",
      courseId: "c-next-mastery",
      courseCode: "NX-410",
      title: "Routing challenge: parallel routes",
      description: "Build a modal-on-route using intercepting routes + slot.",
      status: "open",
      dueAt: isoDaysAhead(5),
      totalMarks: 100,
      submitted: 18,
      graded: 6,
      totalStudents: 38,
      type: "homework",
    },
    {
      id: "a-nx-2",
      courseId: "c-next-mastery",
      courseCode: "NX-410",
      title: "Project: Multi-tenant LMS shell",
      description: "Server Components + Server Actions + RBAC layout.",
      status: "open",
      dueAt: isoDaysAhead(20),
      totalMarks: 250,
      submitted: 2,
      graded: 0,
      totalStudents: 38,
      type: "project",
    },
  ],
};

export const submissionsByAssignment: Record<string, ReadonlyArray<SubmissionRow>> = {
  "a-2": [
    {
      id: "sub-1",
      studentId: "s-1",
      studentName: "Ayesha Siddiqui",
      initials: "AS",
      submittedAt: isoDaysAgo(2),
      status: "pending",
      score: null,
      feedback: null,
      attachments: 3,
    },
    {
      id: "sub-2",
      studentId: "s-2",
      studentName: "Hamza Tariq",
      initials: "HT",
      submittedAt: isoDaysAgo(2),
      status: "pending",
      score: null,
      feedback: null,
      attachments: 1,
    },
    {
      id: "sub-3",
      studentId: "s-3",
      studentName: "Maham Javed",
      initials: "MJ",
      submittedAt: isoDaysAgo(3),
      status: "late",
      score: null,
      feedback: null,
      attachments: 2,
    },
    {
      id: "sub-4",
      studentId: "s-4",
      studentName: "Bilal Ashraf",
      initials: "BA",
      submittedAt: isoDaysAgo(1),
      status: "pending",
      score: null,
      feedback: null,
      attachments: 1,
    },
    {
      id: "sub-5",
      studentId: "s-5",
      studentName: "Sara Naseem",
      initials: "SN",
      submittedAt: isoDaysAgo(2),
      status: "graded",
      score: 96,
      feedback: "Clean discriminator edge cases. Watch null branch on parse.",
      attachments: 4,
    },
    {
      id: "sub-6",
      studentId: "s-6",
      studentName: "Owais Iqbal",
      initials: "OI",
      submittedAt: isoDaysAgo(4),
      status: "pending",
      score: null,
      feedback: null,
      attachments: 1,
    },
  ],
};

// ---------- Quizzes ----------

export const teacherQuizzes: ReadonlyArray<TeacherQuiz> = [
  {
    id: "qz-1",
    courseId: "c-ts-bootcamp",
    courseCode: "TS-301",
    title: "Conditional types basics",
    questionCount: 12,
    attempts: 38,
    avgScore: 82,
    status: "published",
    durationMin: 25,
    updatedAt: isoDaysAgo(2),
  },
  {
    id: "qz-2",
    courseId: "c-ts-bootcamp",
    courseCode: "TS-301",
    title: "Mapped & template literal types",
    questionCount: 14,
    attempts: 22,
    avgScore: 71,
    status: "published",
    durationMin: 30,
    updatedAt: isoDaysAgo(2),
  },
  {
    id: "qz-3",
    courseId: "c-ts-bootcamp",
    courseCode: "TS-301",
    title: "Generics  -  function & class",
    questionCount: 10,
    attempts: 41,
    avgScore: 88,
    status: "published",
    durationMin: 20,
    updatedAt: isoDaysAgo(11),
  },
  {
    id: "qz-4",
    courseId: "c-next-mastery",
    courseCode: "NX-410",
    title: "Server Actions & revalidation",
    questionCount: 12,
    attempts: 30,
    avgScore: 76,
    status: "published",
    durationMin: 25,
    updatedAt: isoDaysAgo(1),
  },
  {
    id: "qz-5",
    courseId: "c-postgres-foundations",
    courseCode: "PG-220",
    title: "Normalization to 3NF",
    questionCount: 15,
    attempts: 28,
    avgScore: 79,
    status: "published",
    durationMin: 30,
    updatedAt: isoDaysAgo(8),
  },
  {
      id: "qz-6",
      courseId: "c-system-design-101",
      courseCode: "SD-101",
      title: "Caching strategies",
      questionCount: 12,
      attempts: 12,
      avgScore: 64,
      status: "draft",
      durationMin: 25,
      updatedAt: isoDaysAgo(3),
    },
];

export const quizResultsByQuiz: Record<string, ReadonlyArray<QuizResultRow>> = {
  "qz-1": [
    {
      id: "r-1",
      studentId: "s-1",
      studentName: "Ayesha Siddiqui",
      initials: "AS",
      attemptedAt: isoDaysAgo(2),
      score: 96,
      correct: 11,
      total: 12,
      timeSpentSec: 1_140,
      sectionBreakdown: [
        { section: "extends ? :", score: 100 },
        { section: "infer keyword", score: 90 },
        { section: "narrowing", score: 100 },
      ],
    },
    {
      id: "r-2",
      studentId: "s-2",
      studentName: "Hamza Tariq",
      initials: "HT",
      attemptedAt: isoDaysAgo(2),
      score: 84,
      correct: 10,
      total: 12,
      timeSpentSec: 1_320,
      sectionBreakdown: [
        { section: "extends ? :", score: 90 },
        { section: "infer keyword", score: 70 },
        { section: "narrowing", score: 90 },
      ],
    },
    {
      id: "r-3",
      studentId: "s-3",
      studentName: "Maham Javed",
      initials: "MJ",
      attemptedAt: isoDaysAgo(1),
      score: 67,
      correct: 8,
      total: 12,
      timeSpentSec: 1_450,
      sectionBreakdown: [
        { section: "extends ? :", score: 70 },
        { section: "infer keyword", score: 50 },
        { section: "narrowing", score: 80 },
      ],
    },
    {
      id: "r-4",
      studentId: "s-5",
      studentName: "Sara Naseem",
      initials: "SN",
      attemptedAt: isoDaysAgo(2),
      score: 100,
      correct: 12,
      total: 12,
      timeSpentSec: 980,
      sectionBreakdown: [
        { section: "extends ? :", score: 100 },
        { section: "infer keyword", score: 100 },
        { section: "narrowing", score: 100 },
      ],
    },
  ],
};

// ---------- Teacher overview: recent submissions + upcoming ----------

export type RecentSubmission = {
  readonly id: string;
  readonly assignmentTitle: string;
  readonly courseCode: string;
  readonly studentName: string;
  readonly initials: string;
  readonly submittedAt: string;
  readonly status: "pending" | "graded" | "late";
};

export const recentSubmissions: ReadonlyArray<RecentSubmission> = [
  {
    id: "rs-1",
    assignmentTitle: "Discriminated union router",
    courseCode: "TS-301",
    studentName: "Ayesha Siddiqui",
    initials: "AS",
    submittedAt: isoDaysAgo(0),
    status: "pending",
  },
  {
    id: "rs-2",
    assignmentTitle: "Parallel routes challenge",
    courseCode: "NX-410",
    studentName: "Hamza Tariq",
    initials: "HT",
    submittedAt: isoDaysAgo(0),
    status: "pending",
  },
  {
    id: "rs-3",
    assignmentTitle: "Branding primitives lab",
    courseCode: "TS-301",
    studentName: "Bilal Ashraf",
    initials: "BA",
    submittedAt: isoDaysAgo(1),
    status: "late",
  },
  {
    id: "rs-4",
    assignmentTitle: "Schema design worksheet",
    courseCode: "PG-220",
    studentName: "Fatima Rehman",
    initials: "FR",
    submittedAt: isoDaysAgo(1),
    status: "pending",
  },
  {
    id: "rs-5",
    assignmentTitle: "Reading: Effective TS",
    courseCode: "TS-301",
    studentName: "Sara Naseem",
    initials: "SN",
    submittedAt: isoDaysAgo(1),
    status: "graded",
  },
  {
    id: "rs-6",
    assignmentTitle: "System design v2",
    courseCode: "SD-101",
    studentName: "Owais Iqbal",
    initials: "OI",
    submittedAt: isoDaysAgo(2),
    status: "pending",
  },
];

export type UpcomingTeachingEvent = {
  readonly id: string;
  readonly kind: "assignment" | "quiz" | "live";
  readonly title: string;
  readonly courseCode: string;
  readonly dueAt: string;
  readonly href: string;
};

export const upcomingTeaching: ReadonlyArray<UpcomingTeachingEvent> = [
  {
    id: "u-1",
    kind: "assignment",
    title: "Discriminated union router",
    courseCode: "TS-301",
    dueAt: isoDaysAhead(2),
    href: "/dashboard/teacher/courses/c-ts-bootcamp/assignments/a-2",
  },
  {
    id: "u-2",
    kind: "live",
    title: "Live: TanStack Form office hours",
    courseCode: "NX-410",
    dueAt: isoDaysAhead(3),
    href: "/dashboard/teacher/schedule",
  },
  {
    id: "u-3",
    kind: "assignment",
    title: "Parallel routes challenge",
    courseCode: "NX-410",
    dueAt: isoDaysAhead(4),
    href: "/dashboard/teacher/courses/c-next-mastery/assignments/a-nx-1",
  },
  {
    id: "u-4",
    kind: "quiz",
    title: "Generics  -  function & class retake",
    courseCode: "TS-301",
    dueAt: isoDaysAhead(6),
    href: "/dashboard/teacher/quizzes/qz-3",
  },
  {
    id: "u-5",
    kind: "assignment",
    title: "Project: Type-safe API client",
    courseCode: "TS-301",
    dueAt: isoDaysAhead(9),
    href: "/dashboard/teacher/courses/c-ts-bootcamp/assignments/a-3",
  },
];
