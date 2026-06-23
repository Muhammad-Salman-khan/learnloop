// Static demo data for the student dashboard.
// This is intentionally a single typed module so the Server Component page
// can read it without touching the DB (real models land later).
// All "demo" labels in UI copy guard against mistaking this for live data.

// --- Tabular data for the student sub-pages (Courses, Schedule, Grades, Messages)

// Per-course assignment breakdown used on the Grades page table.
export type CourseGradeRow = {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly instructor: string;
  readonly credits: number;
  readonly currentGrade: string;
  readonly termGpa: number; // 0.0..4.0
  readonly completed: number;
  readonly total: number;
};

// Detailed assignment scores for a single course, shown on Grades detail rows.
export type AssignmentScore = {
  readonly id: string;
  readonly courseCode: string;
  readonly title: string;
  readonly category: "quiz" | "assignment" | "midterm" | "final" | "project";
  readonly score: number; // 0..100
  readonly weight: number; // percentage of course
  readonly submittedAt: string;
  readonly status: "graded" | "pending" | "late";
};

// Weekly timetable rows used on the Schedule page.
//
// `classTeacher` is the cohort homeroom / class teacher assigned to the
// student's overall group for that course (one per course). The `instructor`
// field is the teacher who runs THIS specific period — which may differ when a
// course is shared across multiple sections. Reviews distinguish between the
// two on purpose: a class teacher is reviewed once per course, while a period
// teacher is reviewed per slot (so a swap teacher can be evaluated on their
// specific delivery in a specific period).
export type ScheduleSlot = {
  readonly id: string;
  readonly courseCode: string;
  readonly courseTitle: string;
  readonly instructor: string;
  readonly classTeacher: string;
  readonly isPeriodTeacher: boolean; // true when instructor != classTeacher
  readonly day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  readonly startTime: string; // "09:00"
  readonly endTime: string; // "10:30"
  readonly room: string;
  readonly mode: "in_person" | "live_online" | "recorded";
};

// Student-authored review of an instructor, scoped to either the cohort's
// class teacher (course-level) or a specific period teacher (slot-level).
export type TeacherReview = {
  readonly id: string;
  readonly kind: "class_teacher" | "period_teacher";
  readonly courseCode: string;
  readonly slotId?: string; // required for period_teacher; resolved against ScheduleSlot.id
  readonly teacherName: string;
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly comment: string;
  readonly anonymous: boolean;
  readonly submittedAt: string;
};

// Direct message threads + their latest preview, used for the Messages inbox table.
export type MessageThread = {
  readonly id: string;
  readonly kind: "direct" | "course";
  readonly counterpart: string; // instructor name or course thread label
  readonly context: string; // course or topic for direct messages
  readonly preview: string;
  readonly updatedAt: string;
  readonly unread: number;
};

export type StudentKpi = {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly trend: "up" | "down" | "flat";
  readonly footnote: string;
};

export type EnrolledCourse = {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly instructor: string;
  readonly progress: number; // 0..100
  readonly nextSession: string;
  readonly grade: string;
  readonly status: "in_progress" | "at_risk" | "completed";
};

export type UpcomingItem = {
  readonly id: string;
  readonly kind: "assignment" | "quiz" | "live" | "exam";
  readonly title: string;
  readonly course: string;
  readonly dueAt: string;
};

export type ActivityEntry = {
  readonly id: string;
  readonly actor: string;
  readonly action: string;
  readonly target: string;
  readonly at: string;
};

export type Announcement = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly postedAt: string;
  readonly postedBy: string;
};

// 12 weeks of demo data for the two chart series.
export type WeekPoint = {
  readonly week: string;
  readonly studyHours: number;
  readonly averageGrade: number;
};

export const studentKpis: ReadonlyArray<StudentKpi> = [
  {
    label: "Active courses",
    value: "6",
    delta: "+1",
    trend: "up",
    footnote: "this term",
  },
  {
    label: "Overall GPA",
    value: "3.72",
    delta: "+0.08",
    trend: "up",
    footnote: "across 6 courses",
  },
  {
    label: "Assignments due",
    value: "4",
    delta: "+2",
    trend: "up",
    footnote: "in the next 7 days",
  },
  {
    label: "Attendance",
    value: "94%",
    delta: "-1.2%",
    trend: "down",
    footnote: "last 30 days",
  },
];

export const enrolledCourses: ReadonlyArray<EnrolledCourse> = [
  {
    id: "c-01",
    code: "CS-301",
    title: "Data Structures and Algorithms",
    instructor: "Dr. Sana Qureshi",
    progress: 72,
    nextSession: "Mon, 09:00",
    grade: "A-",
    status: "in_progress",
  },
  {
    id: "c-02",
    code: "CS-318",
    title: "Web Engineering II",
    instructor: "Sir Hammad Raza",
    progress: 58,
    nextSession: "Tue, 11:00",
    grade: "B+",
    status: "in_progress",
  },
  {
    id: "c-03",
    code: "MTH-204",
    title: "Linear Algebra",
    instructor: "Dr. Imran Siddiqui",
    progress: 41,
    nextSession: "Wed, 14:00",
    grade: "B",
    status: "at_risk",
  },
  {
    id: "c-04",
    code: "ENG-110",
    title: "Technical Writing",
    instructor: "Ms. Hira Naseem",
    progress: 88,
    nextSession: "Thu, 10:00",
    grade: "A",
    status: "in_progress",
  },
  {
    id: "c-05",
    code: "CS-340",
    title: "Database Systems",
    instructor: "Sir Bilal Akhtar",
    progress: 65,
    nextSession: "Fri, 13:00",
    grade: "B+",
    status: "in_progress",
  },
  {
    id: "c-06",
    code: "CS-360",
    title: "Software Engineering Capstone",
    instructor: "Dr. Sana Qureshi",
    progress: 100,
    nextSession: "Submitted",
    grade: "A",
    status: "completed",
  },
];

export const upcomingItems: ReadonlyArray<UpcomingItem> = [
  {
    id: "u-01",
    kind: "assignment",
    title: "Binary trees worksheet",
    course: "Data Structures and Algorithms",
    dueAt: "Tue, 18:00",
  },
  {
    id: "u-02",
    kind: "quiz",
    title: "Closures and scope",
    course: "Web Engineering II",
    dueAt: "Wed, 23:59",
  },
  {
    id: "u-03",
    kind: "live",
    title: "Live lecture: Eigenvalues",
    course: "Linear Algebra",
    dueAt: "Wed, 14:00",
  },
  {
    id: "u-04",
    kind: "assignment",
    title: "ER diagram review",
    course: "Database Systems",
    dueAt: "Thu, 18:00",
  },
  {
    id: "u-05",
    kind: "assignment",
    title: "Final reflective essay",
    course: "Technical Writing",
    dueAt: "Fri, 12:00",
  },
  {
    id: "u-06",
    kind: "exam",
    title: "Midterm retake window",
    course: "Linear Algebra",
    dueAt: "Sat, all-day",
  },
];

export const activityFeed: ReadonlyArray<ActivityEntry> = [
  {
    id: "a-01",
    actor: "Dr. Sana Qureshi",
    action: "graded",
    target: "DSA assignment 04",
    at: "2h ago",
  },
  {
    id: "a-02",
    actor: "Sir Bilal Akhtar",
    action: "posted",
    target: "Database normalization slides",
    at: "yesterday",
  },
  {
    id: "a-03",
    actor: "Ms. Hira Naseem",
    action: "commented on",
    target: "your Technical Writing draft",
    at: "yesterday",
  },
  {
    id: "a-04",
    actor: "System",
    action: "reminder:",
    target: "submit attendance acknowledgement",
    at: "2 days ago",
  },
  {
    id: "a-05",
    actor: "Dr. Imran Siddiqui",
    action: "released",
    target: "Linear Algebra quiz 03 results",
    at: "3 days ago",
  },
  {
    id: "a-06",
    actor: "Study group",
    action: "scheduled",
    target: "Web Eng review session, Sat 17:00",
    at: "4 days ago",
  },
];

export const announcements: ReadonlyArray<Announcement> = [
  {
    id: "n-01",
    title: "Midterm retake window opens Saturday",
    body:
      "Students above 80 percent attendance in MTH-204 may retake one midterm. Form opens Saturday at 09:00 and closes midnight Monday.",
    postedAt: "Posted today, 09:12",
    postedBy: "Office of the Registrar",
  },
  {
    id: "n-02",
    title: "Capstone showcase: live demo day",
    body:
      "Cohort 16 capstone demos run Friday week 14. Submit your repo and recording link to the showcase board by Thursday 18:00.",
    postedAt: "Posted yesterday",
    postedBy: "Dr. Sana Qureshi",
  },
  {
    id: "n-03",
    title: "Library access extended during finals",
    body:
      "SMIT library hours extend to 22:00 from week 12 through finals week. Reserve rooms through the dashboard reservation panel.",
    postedAt: "Posted 3 days ago",
    postedBy: "Library Services",
  },
  {
    id: "n-04",
    title: "Office hours moved, Web Eng II",
    body:
      "Sir Hammad Raza office hours move to Thursday 15:00 to 17:00 for the next two weeks. Catch him in Room CS-212 before the Thursday lecture.",
    postedAt: "Posted 4 days ago",
    postedBy: "Sir Hammad Raza",
  },
];

export const weeklySeries: ReadonlyArray<WeekPoint> = [
  { week: "W1", studyHours: 11, averageGrade: 78 },
  { week: "W2", studyHours: 14, averageGrade: 81 },
  { week: "W3", studyHours: 10, averageGrade: 79 },
  { week: "W4", studyHours: 17, averageGrade: 84 },
  { week: "W5", studyHours: 13, averageGrade: 82 },
  { week: "W6", studyHours: 19, averageGrade: 86 },
  { week: "W7", studyHours: 16, averageGrade: 85 },
  { week: "W8", studyHours: 21, averageGrade: 88 },
  { week: "W9", studyHours: 18, averageGrade: 87 },
  { week: "W10", studyHours: 22, averageGrade: 91 },
  { week: "W11", studyHours: 20, averageGrade: 90 },
  { week: "W12", studyHours: 24, averageGrade: 93 },
];

// --- Courses page (table)
export const courseGradeRows: ReadonlyArray<CourseGradeRow> = [
  {
    id: "g-01",
    code: "CS-301",
    title: "Data Structures and Algorithms",
    instructor: "Dr. Sana Qureshi",
    credits: 4,
    currentGrade: "A-",
    termGpa: 3.7,
    completed: 8,
    total: 11,
  },
  {
    id: "g-02",
    code: "CS-318",
    title: "Web Engineering II",
    instructor: "Sir Hammad Raza",
    credits: 3,
    currentGrade: "B+",
    termGpa: 3.3,
    completed: 6,
    total: 10,
  },
  {
    id: "g-03",
    code: "MTH-204",
    title: "Linear Algebra",
    instructor: "Dr. Imran Siddiqui",
    credits: 3,
    currentGrade: "B",
    termGpa: 3.0,
    completed: 4,
    total: 9,
  },
  {
    id: "g-04",
    code: "ENG-110",
    title: "Technical Writing",
    instructor: "Ms. Hira Naseem",
    credits: 2,
    currentGrade: "A",
    termGpa: 4.0,
    completed: 9,
    total: 10,
  },
  {
    id: "g-05",
    code: "CS-340",
    title: "Database Systems",
    instructor: "Sir Bilal Akhtar",
    credits: 3,
    currentGrade: "B+",
    termGpa: 3.3,
    completed: 7,
    total: 11,
  },
  {
    id: "g-06",
    code: "CS-360",
    title: "Software Engineering Capstone",
    instructor: "Dr. Sana Qureshi",
    credits: 4,
    currentGrade: "A",
    termGpa: 4.0,
    completed: 12,
    total: 12,
  },
];

// --- Grades page (table)
export const assignmentScores: ReadonlyArray<AssignmentScore> = [
  {
    id: "a-01",
    courseCode: "CS-301",
    title: "Binary trees worksheet",
    category: "assignment",
    score: 88,
    weight: 5,
    submittedAt: "Tue, 18:00",
    status: "graded",
  },
  {
    id: "a-02",
    courseCode: "CS-301",
    title: "Midterm: Sorting and searching",
    category: "midterm",
    score: 84,
    weight: 20,
    submittedAt: "Mon, 09:00",
    status: "graded",
  },
  {
    id: "a-03",
    courseCode: "CS-318",
    title: "Closures and scope",
    category: "quiz",
    score: 0,
    weight: 5,
    submittedAt: "Wed, 23:59",
    status: "pending",
  },
  {
    id: "a-04",
    courseCode: "CS-318",
    title: "Capstone proposal",
    category: "project",
    score: 91,
    weight: 15,
    submittedAt: "Fri, 17:00",
    status: "graded",
  },
  {
    id: "a-05",
    courseCode: "MTH-204",
    title: "Eigenvalues problem set",
    category: "assignment",
    score: 62,
    weight: 5,
    submittedAt: "Thu, 23:59",
    status: "late",
  },
  {
    id: "a-06",
    courseCode: "MTH-204",
    title: "Midterm retake",
    category: "midterm",
    score: 0,
    weight: 20,
    submittedAt: "Sat, all-day",
    status: "pending",
  },
  {
    id: "a-07",
    courseCode: "ENG-110",
    title: "Final reflective essay",
    category: "final",
    score: 0,
    weight: 30,
    submittedAt: "Fri, 12:00",
    status: "pending",
  },
  {
    id: "a-08",
    courseCode: "CS-340",
    title: "ER diagram review",
    category: "assignment",
    score: 79,
    weight: 8,
    submittedAt: "Thu, 18:00",
    status: "graded",
  },
  {
    id: "a-09",
    courseCode: "CS-360",
    title: "Final showcase demo",
    category: "final",
    score: 96,
    weight: 40,
    submittedAt: "Fri, 14:00",
    status: "graded",
  },
];

// --- Schedule page (table)
export const scheduleSlots: ReadonlyArray<ScheduleSlot> = [
  {
    id: "sc-01",
    courseCode: "CS-301",
    courseTitle: "Data Structures and Algorithms",
    instructor: "Dr. Sana Qureshi",
    classTeacher: "Dr. Sana Qureshi",
    isPeriodTeacher: false,
    day: "Mon",
    startTime: "09:00",
    endTime: "10:30",
    room: "Room CS-101",
    mode: "in_person",
  },
  {
    id: "sc-02",
    courseCode: "CS-318",
    courseTitle: "Web Engineering II",
    instructor: "Sir Hammad Raza",
    classTeacher: "Sir Hammad Raza",
    isPeriodTeacher: false,
    day: "Tue",
    startTime: "11:00",
    endTime: "12:30",
    room: "Room CS-204",
    mode: "in_person",
  },
  {
    id: "sc-03",
    courseCode: "MTH-204",
    courseTitle: "Linear Algebra",
    instructor: "Dr. Imran Siddiqui",
    classTeacher: "Dr. Imran Siddiqui",
    isPeriodTeacher: false,
    day: "Wed",
    startTime: "14:00",
    endTime: "15:30",
    room: "Live link",
    mode: "live_online",
  },
  {
    id: "sc-04",
    courseCode: "ENG-110",
    courseTitle: "Technical Writing",
    instructor: "Ms. Hira Naseem",
    classTeacher: "Ms. Hira Naseem",
    isPeriodTeacher: false,
    day: "Thu",
    startTime: "10:00",
    endTime: "11:30",
    room: "Room CS-202",
    mode: "in_person",
  },
  {
    id: "sc-05",
    courseCode: "CS-340",
    courseTitle: "Database Systems",
    instructor: "Sir Bilal Akhtar",
    classTeacher: "Sir Bilal Akhtar",
    isPeriodTeacher: false,
    day: "Fri",
    startTime: "13:00",
    endTime: "14:30",
    room: "Room CS-204",
    mode: "in_person",
  },
  {
    id: "sc-06",
    courseCode: "CS-301",
    courseTitle: "Data Structures and Algorithms",
    instructor: "Dr. Sana Qureshi",
    classTeacher: "Dr. Sana Qureshi",
    isPeriodTeacher: false,
    day: "Mon",
    startTime: "11:00",
    endTime: "12:00",
    room: "Room CS-101",
    mode: "in_person",
  },
  {
    id: "sc-07",
    courseCode: "CS-340",
    courseTitle: "Database Systems",
    instructor: "Sir Bilal Akhtar",
    classTeacher: "Sir Bilal Akhtar",
    isPeriodTeacher: false,
    day: "Wed",
    startTime: "09:00",
    endTime: "10:30",
    room: "Recording",
    mode: "recorded",
  },
  {
    id: "sc-08",
    courseCode: "MTH-204",
    courseTitle: "Linear Algebra",
    instructor: "Dr. Imran Siddiqui",
    classTeacher: "Dr. Imran Siddiqui",
    isPeriodTeacher: false,
    day: "Mon",
    startTime: "13:00",
    endTime: "14:00",
    room: "Room CS-208",
    mode: "in_person",
  },
  {
    id: "sc-09",
    courseCode: "CS-318",
    courseTitle: "Web Engineering II",
    instructor: "Ms. Ayesha Khalid",
    classTeacher: "Sir Hammad Raza",
    isPeriodTeacher: true,
    day: "Thu",
    startTime: "15:00",
    endTime: "17:00",
    room: "Room CS-204",
    mode: "in_person",
  },
];

// --- Messages page (table)
export const messageThreads: ReadonlyArray<MessageThread> = [
  {
    id: "m-01",
    kind: "direct",
    counterpart: "Dr. Sana Qureshi",
    context: "Data Structures and Algorithms",
    preview:
      "I posted the solutions for assignment 04. Stop by office hours if you want to walk through the grading rubric.",
    updatedAt: "2h ago",
    unread: 2,
  },
  {
    id: "m-02",
    kind: "course",
    counterpart: "CS-318 · Web Engineering II",
    context: "Cohort 16",
    preview:
      "Reminder: the Closures and scope quiz closes Wednesday at 23:59. Use the closed-book timer.",
    updatedAt: "yesterday",
    unread: 0,
  },
  {
    id: "m-03",
    kind: "direct",
    counterpart: "Ms. Hira Naseem",
    context: "Technical Writing",
    preview:
      "Left comments on your draft. Tighten the thesis paragraph and resubmit by Friday 12:00.",
    updatedAt: "yesterday",
    unread: 1,
  },
  {
    id: "m-04",
    kind: "direct",
    counterpart: "Sir Bilal Akhtar",
    context: "Database Systems",
    preview:
      "Normalization slides are up. Lab 03 grading will start Thursday afternoon.",
    updatedAt: "2 days ago",
    unread: 0,
  },
  {
    id: "m-05",
    kind: "course",
    counterpart: "MTH-204 · Linear Algebra",
    context: "Cohort 16",
    preview:
      "Midterm retake window opens Saturday 09:00 and closes Monday midnight. Form attached.",
    updatedAt: "2 days ago",
    unread: 3,
  },
  {
    id: "m-06",
    kind: "direct",
    counterpart: "Office of the Registrar",
    context: "Account",
    preview:
      "Your attendance acknowledgement for week 11 is still pending. Submit it before Friday 17:00.",
    updatedAt: "3 days ago",
    unread: 0,
  },
  {
    id: "m-07",
    kind: "direct",
    counterpart: "Study group · Web Eng",
    context: "Group thread",
    preview:
      "Saturday review session locked in at 17:00. Bringing the printed cheatsheet for everyone.",
    updatedAt: "4 days ago",
    unread: 0,
  },
];

// --- Schedule page (teacher reviews)
//
// Seed reviews so the demo state is non-empty on first render. New reviews
// created from the ScheduleReviews form land alongside these via local state
// in the client island (no DB yet).
export const teacherReviews: ReadonlyArray<TeacherReview> = [
  {
    id: "rv-01",
    kind: "class_teacher",
    courseCode: "CS-301",
    teacherName: "Dr. Sana Qureshi",
    rating: 5,
    comment:
      "Office hours always start on time and she remembers where we left off last week. Grading turnaround is two business days.",
    anonymous: false,
    submittedAt: "3 days ago",
  },
  {
    id: "rv-02",
    kind: "period_teacher",
    courseCode: "CS-318",
    slotId: "sc-09",
    teacherName: "Ms. Ayesha Khalid",
    rating: 4,
    comment:
      "Picked up Hammad's lecture plan cleanly. Brought a worked example for closures that unlocked the quiz for me. Audio cut around 16:20, worth a note for next time.",
    anonymous: true,
    submittedAt: "yesterday",
  },
  {
    id: "rv-03",
    kind: "class_teacher",
    courseCode: "MTH-204",
    teacherName: "Dr. Imran Siddiqui",
    rating: 3,
    comment:
      "Concepts are clear but the pace in week 9 jumped. Posting the worked solutions before the recorded lecture would help.",
    anonymous: false,
    submittedAt: "5 days ago",
  },
];
