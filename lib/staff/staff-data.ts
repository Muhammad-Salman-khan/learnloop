// Staff dashboard demo data module.
//
// Single typed source of truth for every page under /dashboard/staff/*.
// Re-exports the shared admin data (users, students, teachers, courses,
// enrollments) and adds the staff-specific surfaces:
//
//   - ScheduleEntry   — the weekly timetable
//   - ResultRow       — quiz + assignment scores per enrollment
//   - StaffAlert      — the notifications inbox (Normal / Urgent)
//
// All copy labels MOUNTED IN UI include a "demo data" marker so the mocked
// numbers are never confused for live state. Swap this module for Prisma
// queries once the schema lands.

import {
  // user / role / student / teacher / course / enrollment / fee / announcement
  adminUsers,
  adminStudents,
  adminTeachers,
  adminCourses,
  adminEnrollments,
  feeRecords,
  type AdminUser,
  type AdminStudent,
  type AdminTeacher,
  type AdminCourse,
  type AdminEnrollment,
  type AdminKpi,
  type FeeRecord,
  findUser,
  findStudent,
  findTeacher,
  findCourse,
  findAnnouncement,
  countsByRole,
  feeSummary,
  // re-export them so pages don't need to reach into admin-data directly
  type AdminAnnouncement,
} from "@/lib/admin/admin-data";

// ============================================================
// Schedule  (day / time / room / course / teacher / recurrence)
// ============================================================

export type ScheduleWeekday =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun";

export const SCHEDULE_WEEKDAYS: ReadonlyArray<ScheduleWeekday> = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export function weekdayLabel(day: ScheduleWeekday): string {
  if (day === "mon") return "Monday";
  if (day === "tue") return "Tuesday";
  if (day === "wed") return "Wednesday";
  if (day === "thu") return "Thursday";
  if (day === "fri") return "Friday";
  if (day === "sat") return "Saturday";
  return "Sunday";
}

export function weekdayShortLabel(day: ScheduleWeekday): string {
  if (day === "mon") return "Mon";
  if (day === "tue") return "Tue";
  if (day === "wed") return "Wed";
  if (day === "thu") return "Thu";
  if (day === "fri") return "Fri";
  if (day === "sat") return "Sat";
  return "Sun";
}

export type ScheduleRecurrence = "weekly" | "biweekly" | "one-off";

export type ScheduleEntry = {
  readonly id: string;
  readonly courseId: string;
  readonly teacherUserId: string;
  readonly day: ScheduleWeekday;
  /** 24-hour, "HH:MM" */
  readonly startTime: string;
  readonly endTime: string;
  readonly room: string;
  readonly recurrence: ScheduleRecurrence;
  readonly notes: string | null;
};

// ============================================================
// Results  (quiz + assignment scores per enrollment)
// ============================================================

export type ResultKind = "quiz" | "assignment" | "midterm" | "final";

export const RESULT_KINDS: ReadonlyArray<ResultKind> = [
  "quiz",
  "assignment",
  "midterm",
  "final",
];

export function resultKindLabel(kind: ResultKind): string {
  if (kind === "quiz") return "Quiz";
  if (kind === "assignment") return "Assignment";
  if (kind === "midterm") return "Midterm";
  return "Final";
}

export type ResultRow = {
  readonly id: string;
  readonly studentUserId: string;
  readonly courseId: string;
  readonly title: string;
  readonly kind: ResultKind;
  /** 0–100 */
  readonly score: number;
  /** "out of" — e.g. 100 for a quiz, 50 for an assignment */
  readonly maxScore: number;
  readonly submittedOn: string;
  readonly gradedByUserId: string;
};

export function percentFromRow(row: ResultRow): number {
  if (row.maxScore <= 0) return 0;
  return Math.round((row.score / row.maxScore) * 100);
}

export function gradeLetter(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 85) return "A";
  if (pct >= 80) return "A-";
  if (pct >= 75) return "B+";
  if (pct >= 70) return "B";
  if (pct >= 65) return "B-";
  if (pct >= 60) return "C+";
  if (pct >= 55) return "C";
  if (pct >= 50) return "C-";
  if (pct >= 40) return "D";
  return "F";
}

// ============================================================
// Staff Alerts  (the notifications inbox)
// ============================================================

export type AlertSeverity = "normal" | "urgent";

export const ALERT_SEVERITIES: ReadonlyArray<AlertSeverity> = [
  "normal",
  "urgent",
];

export function severityLabel(severity: AlertSeverity): string {
  return severity === "urgent" ? "Urgent" : "Normal";
}

export type AlertAudience =
  | "all"
  | "students"
  | "teachers"
  | "staff"
  | { kind: "batch"; batchName: string };

export type StaffAlert = {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly severity: AlertSeverity;
  readonly audience: AlertAudience;
  readonly publishedAt: string;
  readonly authorUserId: string;
};

// Helper to render an audience union
export function audienceLabel(audience: AlertAudience): string {
  if (typeof audience === "string") {
    if (audience === "all") return "Everyone";
    if (audience === "students") return "Students only";
    if (audience === "teachers") return "Teachers only";
    return "Staff only";
  }
  return `Batch: ${audience.batchName}`;
}

// ============================================================
// SEED  --  schedule + results + alerts
// ============================================================

const today = new Date("2026-01-12T09:00:00Z"); // Mon Jan 12, 2026
function daysAgo(n: number): string {
  const d = new Date(today.getTime() - n * 24 * 60 * 60 * 1000);
  return d.toISOString();
}
function daysAhead(n: number): string {
  const d = new Date(today.getTime() + n * 24 * 60 * 60 * 1000);
  return d.toISOString();
}

// ---------- Schedule entries (18) ----------
export const scheduleEntries: ReadonlyArray<ScheduleEntry> = [
  // Monday
  {
    id: "sch_01",
    courseId: "crs_01",
    teacherUserId: "usr_07",
    day: "mon",
    startTime: "09:00",
    endTime: "10:30",
    room: "Hall A",
    recurrence: "weekly",
    notes: "Lecture — bring laptops",
  },
  {
    id: "sch_02",
    courseId: "crs_03",
    teacherUserId: "usr_09",
    day: "mon",
    startTime: "11:00",
    endTime: "12:30",
    room: "Lab 2",
    recurrence: "weekly",
    notes: null,
  },
  {
    id: "sch_03",
    courseId: "crs_02",
    teacherUserId: "usr_08",
    day: "mon",
    startTime: "14:00",
    endTime: "15:30",
    room: "Hall B",
    recurrence: "weekly",
    notes: null,
  },
  // Tuesday
  {
    id: "sch_04",
    courseId: "crs_04",
    teacherUserId: "usr_10",
    day: "tue",
    startTime: "09:30",
    endTime: "11:00",
    room: "Studio 1",
    recurrence: "weekly",
    notes: "Capstone supervision",
  },
  {
    id: "sch_05",
    courseId: "crs_06",
    teacherUserId: "usr_08",
    day: "tue",
    startTime: "11:30",
    endTime: "13:00",
    room: "Hall A",
    recurrence: "weekly",
    notes: null,
  },
  {
    id: "sch_06",
    courseId: "crs_08",
    teacherUserId: "usr_10",
    day: "tue",
    startTime: "15:00",
    endTime: "16:30",
    room: "Lab 1",
    recurrence: "weekly",
    notes: "Live bug-bash sessions",
  },
  // Wednesday
  {
    id: "sch_07",
    courseId: "crs_01",
    teacherUserId: "usr_07",
    day: "wed",
    startTime: "09:00",
    endTime: "10:30",
    room: "Hall A",
    recurrence: "weekly",
    notes: null,
  },
  {
    id: "sch_08",
    courseId: "crs_02",
    teacherUserId: "usr_08",
    day: "wed",
    startTime: "11:00",
    endTime: "12:30",
    room: "Hall B",
    recurrence: "weekly",
    notes: null,
  },
  // Thursday
  {
    id: "sch_09",
    courseId: "crs_03",
    teacherUserId: "usr_09",
    day: "thu",
    startTime: "10:00",
    endTime: "11:30",
    room: "Lab 2",
    recurrence: "weekly",
    notes: null,
  },
  {
    id: "sch_10",
    courseId: "crs_04",
    teacherUserId: "usr_10",
    day: "thu",
    startTime: "13:30",
    endTime: "15:00",
    room: "Studio 1",
    recurrence: "weekly",
    notes: null,
  },
  // Friday
  {
    id: "sch_11",
    courseId: "crs_06",
    teacherUserId: "usr_08",
    day: "fri",
    startTime: "09:00",
    endTime: "10:30",
    room: "Hall A",
    recurrence: "weekly",
    notes: "Friday problem set",
  },
  {
    id: "sch_12",
    courseId: "crs_08",
    teacherUserId: "usr_10",
    day: "fri",
    startTime: "11:00",
    endTime: "12:30",
    room: "Lab 1",
    recurrence: "weekly",
    notes: null,
  },
  // Saturday workshop
  {
    id: "sch_13",
    courseId: "crs_02",
    teacherUserId: "usr_08",
    day: "sat",
    startTime: "10:00",
    endTime: "13:00",
    room: "Hall B",
    recurrence: "biweekly",
    notes: "Project clinic alternate weeks",
  },
  // Sunday special
  {
    id: "sch_14",
    courseId: "crs_05",
    teacherUserId: "usr_07",
    day: "sun",
    startTime: "15:00",
    endTime: "17:00",
    room: "Studio 2",
    recurrence: "one-off",
    notes: "RN-150 launch preview",
  },
];

// ---------- Result rows (24) ----------
export const resultRows: ReadonlyArray<ResultRow> = [
  { id: "res_01", studentUserId: "usr_11", courseId: "crs_01", title: "Module 1 — Types & narrowing",          kind: "quiz",       score: 88, maxScore: 100, submittedOn: daysAgo(56), gradedByUserId: "usr_07" },
  { id: "res_02", studentUserId: "usr_11", courseId: "crs_01", title: "Module 2 — Generics",                  kind: "quiz",       score: 76, maxScore: 100, submittedOn: daysAgo(42), gradedByUserId: "usr_07" },
  { id: "res_03", studentUserId: "usr_11", courseId: "crs_02", title: "App Router fundamentals",             kind: "assignment", score: 42, maxScore: 50,  submittedOn: daysAgo(35), gradedByUserId: "usr_08" },
  { id: "res_04", studentUserId: "usr_11", courseId: "crs_03", title: "Schema design lab",                    kind: "assignment", score: 45, maxScore: 50,  submittedOn: daysAgo(20), gradedByUserId: "usr_09" },
  { id: "res_05", studentUserId: "usr_11", courseId: "crs_01", title: "Midterm",                              kind: "midterm",    score: 81, maxScore: 100, submittedOn: daysAgo(14), gradedByUserId: "usr_07" },
  { id: "res_06", studentUserId: "usr_12", courseId: "crs_01", title: "Module 1 — Types & narrowing",          kind: "quiz",       score: 71, maxScore: 100, submittedOn: daysAgo(58), gradedByUserId: "usr_07" },
  { id: "res_07", studentUserId: "usr_12", courseId: "crs_04", title: "Prompt-patterns essay",                kind: "assignment", score: 38, maxScore: 50,  submittedOn: daysAgo(28), gradedByUserId: "usr_10" },
  { id: "res_08", studentUserId: "usr_12", courseId: "crs_01", title: "Module 2 — Generics",                  kind: "quiz",       score: 65, maxScore: 100, submittedOn: daysAgo(40), gradedByUserId: "usr_07" },
  { id: "res_09", studentUserId: "usr_13", courseId: "crs_02", title: "App Router fundamentals",             kind: "quiz",       score: 92, maxScore: 100, submittedOn: daysAgo(50), gradedByUserId: "usr_08" },
  { id: "res_10", studentUserId: "usr_13", courseId: "crs_03", title: "Indexing lab",                         kind: "assignment", score: 48, maxScore: 50,  submittedOn: daysAgo(22), gradedByUserId: "usr_09" },
  { id: "res_11", studentUserId: "usr_13", courseId: "crs_06", title: "Trees & traversals",                   kind: "quiz",       score: 58, maxScore: 100, submittedOn: daysAgo(18), gradedByUserId: "usr_08" },
  { id: "res_12", studentUserId: "usr_13", courseId: "crs_02", title: "Observability check-in",              kind: "assignment", score: 40, maxScore: 50,  submittedOn: daysAgo(10), gradedByUserId: "usr_08" },
  { id: "res_13", studentUserId: "usr_14", courseId: "crs_01", title: "Module 1 — Types & narrowing",          kind: "quiz",       score: 79, maxScore: 100, submittedOn: daysAgo(48), gradedByUserId: "usr_07" },
  { id: "res_14", studentUserId: "usr_14", courseId: "crs_06", title: "Heaps & priority queues",             kind: "quiz",       score: 70, maxScore: 100, submittedOn: daysAgo(20), gradedByUserId: "usr_08" },
  { id: "res_15", studentUserId: "usr_14", courseId: "crs_08", title: "Property-testing primer",             kind: "assignment", score: 44, maxScore: 50,  submittedOn: daysAgo(8),  gradedByUserId: "usr_10" },
  { id: "res_16", studentUserId: "usr_15", courseId: "crs_03", title: "Migrations & recovery",               kind: "assignment", score: 36, maxScore: 50,  submittedOn: daysAgo(18), gradedByUserId: "usr_09" },
  { id: "res_17", studentUserId: "usr_15", courseId: "crs_08", title: "Integration suite — sample PR",       kind: "assignment", score: 30, maxScore: 50,  submittedOn: daysAgo(6),  gradedByUserId: "usr_10" },
  { id: "res_18", studentUserId: "usr_11", courseId: "crs_02", title: "Caching model",                       kind: "quiz",       score: 73, maxScore: 100, submittedOn: daysAgo(7),  gradedByUserId: "usr_08" },
  { id: "res_19", studentUserId: "usr_12", courseId: "crs_04", title: "Eval pipelines",                      kind: "midterm",    score: 67, maxScore: 100, submittedOn: daysAgo(4),  gradedByUserId: "usr_10" },
  { id: "res_20", studentUserId: "usr_13", courseId: "crs_06", title: "Graphs — BFS & DFS",                  kind: "assignment", score: 41, maxScore: 50,  submittedOn: daysAgo(5),  gradedByUserId: "usr_08" },
  { id: "res_21", studentUserId: "usr_14", courseId: "crs_01", title: "Module 3 — Build pipeline",           kind: "quiz",       score: 84, maxScore: 100, submittedOn: daysAgo(3),  gradedByUserId: "usr_07" },
  { id: "res_22", studentUserId: "usr_15", courseId: "crs_03", title: "Window functions",                    kind: "quiz",       score: 55, maxScore: 100, submittedOn: daysAgo(2),  gradedByUserId: "usr_09" },
  { id: "res_23", studentUserId: "usr_11", courseId: "crs_03", title: "Final — Capstone I",                  kind: "final",      score: 86, maxScore: 100, submittedOn: daysAhead(2), gradedByUserId: "usr_09" },
  { id: "res_24", studentUserId: "usr_14", courseId: "crs_08", title: "Final — Capstone II",                 kind: "final",      score: 78, maxScore: 100, submittedOn: daysAhead(4), gradedByUserId: "usr_10" },
];

// ---------- Staff alerts (8) ----------
export const staffAlerts: ReadonlyArray<StaffAlert> = [
  {
    id: "alt_01",
    title: "Tuition overdue — Sa'ad Iqbal (Jan)",
    message: "January fee is two days past due. Front desk to send a courtesy reminder and offer the payment plan.",
    severity: "urgent",
    audience: "students",
    publishedAt: daysAgo(0),
    authorUserId: "usr_04",
  },
  {
    id: "alt_02",
    title: "Hall B projector fault",
    message: "Projector in Hall B is reporting a lamp fault. Move Monday TS-101 lecture to Hall A until IT resolves.",
    severity: "urgent",
    audience: "teachers",
    publishedAt: daysAgo(1),
    authorUserId: "usr_05",
  },
  {
    id: "alt_03",
    title: "Friday schedule change — RN-150 launch",
    message: "The Sunday preview will move to Friday 3pm in Studio 2 instead. Confirm attendance with enrolled students.",
    severity: "urgent",
    audience: { kind: "batch", batchName: "Senior A" },
    publishedAt: daysAgo(1),
    authorUserId: "usr_04",
  },
  {
    id: "alt_04",
    title: "Midterm marks uploaded for TS-101",
    message: "Sara Naseem has uploaded midterm scores. Staff can pull the per-student breakdown from the results tab.",
    severity: "normal",
    audience: "staff",
    publishedAt: daysAgo(2),
    authorUserId: "usr_04",
  },
  {
    id: "alt_05",
    title: "Open enrollment — Spring 2026",
    message: "Spring cohort enrollment opens Monday. New students should be provisioned with rollNumber and StudentProfile via the Add Student flow.",
    severity: "normal",
    audience: "all",
    publishedAt: daysAgo(4),
    authorUserId: "usr_05",
  },
  {
    id: "alt_06",
    title: "Quarterly planning — Friday 2pm",
    message: "Reminder: all teaching staff meet in Hall B at 2pm Friday. Travel reimbursements ready at the desk.",
    severity: "normal",
    audience: "teachers",
    publishedAt: daysAgo(3),
    authorUserId: "usr_04",
  },
  {
    id: "alt_07",
    title: "Schedule conflict — Wednesday 11am",
    message: "NX-201 and DB-310 are both booked in Hall B at 11am on Wednesday. We need to shift one of them; staff to follow up.",
    severity: "urgent",
    audience: "staff",
    publishedAt: daysAgo(0),
    authorUserId: "usr_04",
  },
  {
    id: "alt_08",
    title: "Final capstone sign-off",
    message: "Final capstone grades for crs_01 and crs_08 are due Friday. Use the export flow to print the result cards.",
    severity: "normal",
    audience: "teachers",
    publishedAt: daysAgo(2),
    authorUserId: "usr_05",
  },
];

// ============================================================
// Re-exports — staff pages import everything from this module
// ============================================================

export {
  adminUsers,
  adminStudents,
  adminTeachers,
  adminCourses,
  adminEnrollments,
  feeRecords,
  type AdminUser,
  type AdminStudent,
  type AdminTeacher,
  type AdminCourse,
  type AdminEnrollment,
  type AdminKpi,
  type FeeRecord,
  type AdminAnnouncement,
};

export {
  findUser,
  findStudent,
  findTeacher,
  findCourse,
  findAnnouncement,
  countsByRole,
  feeSummary,
};

// ============================================================
// Derived selectors
// ============================================================

export function findScheduleEntry(id: string): ScheduleEntry | null {
  return scheduleEntries.find((s) => s.id === id) ?? null;
}

export function findAlert(id: string): StaffAlert | null {
  return staffAlerts.find((a) => a.id === id) ?? null;
}

/** Today's weekday (anchored to 2026-01-12 which is a Monday). */
function todayWeekday(): ScheduleWeekday {
  // 2026-01-12 is a Monday in our mocked timeline.
  return "mon";
}

export type OverviewSnapshot = {
  readonly kpis: ReadonlyArray<AdminKpi>;
  readonly pendingFeeDues: number;
  readonly todaysSchedule: ReadonlyArray<ScheduleEntry>;
  readonly recentEnrollments: ReadonlyArray<{
    readonly id: string;
    readonly studentName: string;
    readonly studentId: string;
    readonly courseTitle: string;
    readonly courseCode: string;
    readonly enrolledAt: string;
  }>;
  readonly unreadUrgent: ReadonlyArray<StaffAlert>;
};

export function buildOverviewSnapshot(): OverviewSnapshot {
  const studentEnrollments = adminEnrollments
    .map((e) => {
      const student = findUser(e.studentUserId);
      const course = findCourse(e.courseId);
      return {
        id: e.id,
        studentName: student?.name ?? "Unknown",
        studentId: e.studentUserId,
        courseTitle: course?.title ?? "Unknown course",
        courseCode: course?.code ?? "—",
        enrolledAt: e.enrolledAt,
      };
    })
    .slice(-5)
    .reverse();

  const todayDay = todayWeekday();
  const todaysSchedule = scheduleEntries
    .filter((s) => s.day === todayDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const feesForCurrentMonth = feeSummary().unpaid + feeSummary().due;

  const unreadUrgent = staffAlerts
    .filter((a) => a.severity === "urgent")
    .slice(0, 4);

  const kpis: ReadonlyArray<AdminKpi> = [
    {
      label: "Pending fee dues",
      value: String(feesForCurrentMonth),
      delta: `${feeSummary().unpaid} unpaid`,
      trend: "down",
      hint: "Across the current cycle",
    },
    { label: "Today's classes", value: String(todaysSchedule.length), hint: weekdayLabel(todayDay) },
    { label: "Unread urgent alerts", value: String(unreadUrgent.length), delta: `${staffAlerts.length} total`, trend: "up" },
    { label: "Recent enrollments", value: String(studentEnrollments.length), hint: "Last 5 across all courses" },
  ];

  return {
    kpis,
    pendingFeeDues: feesForCurrentMonth,
    todaysSchedule,
    recentEnrollments: studentEnrollments,
    unreadUrgent,
  };
}

/** Per-student average across every scored row. */
export function averageForStudent(userId: string): number {
  const rows = resultRows.filter((r) => r.studentUserId === userId);
  if (!rows.length) return 0;
  const sum = rows.reduce((acc, r) => acc + percentFromRow(r), 0);
  return Math.round(sum / rows.length);
}

/** Per-student GPA letter based on the average percent. */
export function gpaForStudent(userId: string): string {
  return gradeLetter(averageForStudent(userId));
}
