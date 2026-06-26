// Admin dashboard demo data module.
// Single typed source of truth for every page under /dashboard/admin/*.
// Modelled after lib/dashboard/teacher-data.ts structure.
//
// All copy labels MOUNTED IN UI include a "demo data" marker so we never
// confuse mocked values for live state. Replace this module with real Prisma
// queries when Course / Enrollment / Fee / Announcement models land.

// ============================================================
// Roles & shared enums
// ============================================================

export type AdminRole =
  | "superAdmin"
  | "admin"
  | "staff"
  | "teacher"
  | "student";

export const ALL_ROLES: ReadonlyArray<AdminRole> = [
  "superAdmin",
  "admin",
  "staff",
  "teacher",
  "student",
];

export function roleLabel(role: AdminRole): string {
  if (role === "superAdmin") return "Super admin";
  return role[0]!.toUpperCase() + role.slice(1);
}

// ============================================================
// User
// ============================================================

export type AdminUser = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly image: string | null;
  readonly role: AdminRole;
  readonly banned: boolean;
  readonly banReason: string | null;
  readonly banExpires: string | null;
  readonly createdAt: string;
  readonly lastSeenAt: string;
};

// ============================================================
// Student / Teacher / Staff  (profile-joined views)
// ============================================================

export type FeeStatus = "paid" | "unpaid" | "due";

export const FEE_STATUSES: ReadonlyArray<FeeStatus> = ["paid", "unpaid", "due"];

export function feeStatusLabel(status: FeeStatus): string {
  if (status === "paid") return "Paid";
  if (status === "unpaid") return "Unpaid";
  return "Due";
}

export type AdminStudent = {
  readonly userId: string;
  readonly rollNumber: string;
  readonly className: string;
  readonly section: string;
  readonly fatherName: string;
  readonly motherName: string;
  readonly dob: string;
  readonly phoneNumber: string;
  readonly parentPhone: string;
  readonly address: string;
  readonly feeStatus: FeeStatus;
  readonly enrolledCourseIds: ReadonlyArray<string>;
  readonly enrollmentDate: string;
};

export type AdminTeacher = {
  readonly userId: string;
  readonly employmentId: string;
  readonly nic: string;
  readonly assignedClass: string | null;
  readonly subjectProficiency: ReadonlyArray<string>;
  readonly section: string | null;
  readonly dob: string;
  readonly phoneNumber: string;
  readonly address: string;
  readonly bio: string;
  readonly isActive: boolean;
  readonly hireDate: string;
  readonly assignedCourseIds: ReadonlyArray<string>;
};

export type AdminStaff = {
  readonly userId: string;
  readonly employmentId: string;
  readonly nic: string;
  readonly department: string;
  readonly designation: string;
  readonly phoneNumber: string;
  readonly address: string;
  readonly bio: string;
  readonly isActive: boolean;
  readonly hireDate: string;
  readonly dob: string | null;
};

// ============================================================
// Course / Enrollment / Fee / Announcement
// ============================================================

export type CourseStatus = "draft" | "live" | "archived";

export function courseStatusLabel(status: CourseStatus): string {
  if (status === "draft") return "Draft";
  if (status === "live") return "Live";
  return "Archived";
}

export type AdminCourse = {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly subtitle: string;
  readonly teacherUserId: string;
  readonly status: CourseStatus;
  readonly capacity: number;
  readonly enrolled: number;
  readonly feePerSeat: number;
  readonly createdAt: string;
  readonly summary: string;
};

export type AdminEnrollment = {
  readonly id: string;
  readonly studentUserId: string;
  readonly courseId: string;
  readonly enrolledAt: string;
  readonly progressPct: number;
};

export type FeeRecord = {
  readonly id: string;
  readonly studentUserId: string;
  readonly monthLabel: string; // e.g. "Nov 2025"
  readonly amount: number;
  readonly status: FeeStatus;
  readonly paidOn: string | null;
  readonly updatedAt: string;
};

export type AnnouncementTarget = "all" | "students" | "teachers" | "staff";

export const ANNOUNCEMENT_TARGETS: ReadonlyArray<AnnouncementTarget> = [
  "all",
  "students",
  "teachers",
  "staff",
];

export function announcementTargetLabel(target: AnnouncementTarget): string {
  if (target === "all") return "Everyone";
  if (target === "students") return "Students only";
  if (target === "teachers") return "Teachers only";
  return "Staff only";
}

export type AdminAnnouncement = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly target: AnnouncementTarget;
  readonly pinned: boolean;
  readonly publishedAt: string;
  readonly authorUserId: string;
};

// ============================================================
// Overview KPIs
// ============================================================

export type AdminKpi = {
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
  readonly trend?: "up" | "down" | "flat";
  readonly hint?: string;
};

// ============================================================
// Recent activity (overview feed)
// ============================================================

export type AdminActivityEntry = {
  readonly id: string;
  readonly actor: string;
  readonly verb: string;
  readonly target: string;
  readonly at: string;
};

// ============================================================
// SEED  --  realistic, larger than feels minimal, so filters
//           and pagination have something to chew on.
// ============================================================

const today = new Date("2026-01-12T09:00:00Z");
function daysAgo(n: number): string {
  const d = new Date(today.getTime() - n * 24 * 60 * 60 * 1000);
  return d.toISOString();
}

// ---------- Users  (15 across all 5 roles) ----------

export const adminUsers: ReadonlyArray<AdminUser> = [
  {
    id: "usr_01",
    name: "Salman Khan",
    email: "alibinkhan465@gmail.com",
    image: null,
    role: "superAdmin",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(420),
    lastSeenAt: daysAgo(0),
  },
  {
    id: "usr_02",
    name: "Hina Karim",
    email: "hina.karim@learnhub.test",
    image: null,
    role: "admin",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(380),
    lastSeenAt: daysAgo(0),
  },
  {
    id: "usr_03",
    name: "Bilal Ashraf",
    email: "bilal.ashraf@learnhub.test",
    image: null,
    role: "admin",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(210),
    lastSeenAt: daysAgo(2),
  },
  {
    id: "usr_04",
    name: "Adeel Rizvi",
    email: "adeel.rizvi@learnhub.test",
    image: null,
    role: "staff",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(190),
    lastSeenAt: daysAgo(1),
  },
  {
    id: "usr_05",
    name: "Mariam Suleman",
    email: "mariam.s@learnhub.test",
    image: null,
    role: "staff",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(150),
    lastSeenAt: daysAgo(0),
  },
  {
    id: "usr_06",
    name: "Kamran Shah",
    email: "kamran.shah@learnhub.test",
    image: null,
    role: "staff",
    banned: true,
    banReason: "Repeated late attendance policy violation.",
    banExpires: daysAgo(-14),
    createdAt: daysAgo(120),
    lastSeenAt: daysAgo(40),
  },
  {
    id: "usr_07",
    name: "Ayesha Siddiqui",
    email: "ayesha.s@learnhub.test",
    image: null,
    role: "teacher",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(310),
    lastSeenAt: daysAgo(0),
  },
  {
    id: "usr_08",
    name: "Hamza Tariq",
    email: "hamza.tariq@learnhub.test",
    image: null,
    role: "teacher",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(280),
    lastSeenAt: daysAgo(1),
  },
  {
    id: "usr_09",
    name: "Sara Naseem",
    email: "sara.naseem@learnhub.test",
    image: null,
    role: "teacher",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(240),
    lastSeenAt: daysAgo(0),
  },
  {
    id: "usr_10",
    name: "Imran Qureshi",
    email: "imran.q@learnhub.test",
    image: null,
    role: "teacher",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(170),
    lastSeenAt: daysAgo(3),
  },
  {
    id: "usr_11",
    name: "Hamza Butt",
    email: "hamza.butt@learnhub.test",
    image: null,
    role: "student",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(60),
    lastSeenAt: daysAgo(0),
  },
  {
    id: "usr_12",
    name: "Areeba Khan",
    email: "areeba.khan@learnhub.test",
    image: null,
    role: "student",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(58),
    lastSeenAt: daysAgo(0),
  },
  {
    id: "usr_13",
    name: "Saad Iqbal",
    email: "saad.iqbal@learnhub.test",
    image: null,
    role: "student",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(55),
    lastSeenAt: daysAgo(1),
  },
  {
    id: "usr_14",
    name: "Fatima Zehra",
    email: "fatima.zehra@learnhub.test",
    image: null,
    role: "student",
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: daysAgo(48),
    lastSeenAt: daysAgo(2),
  },
  {
    id: "usr_15",
    name: "Talha Aslam",
    email: "talha.aslam@learnhub.test",
    image: null,
    role: "student",
    banned: true,
    banReason: "Multiple ToS violations on quizzes.",
    banExpires: null,
    createdAt: daysAgo(35),
    lastSeenAt: daysAgo(20),
  },
];

// ---------- Courses  (8) ----------

export const adminCourses: ReadonlyArray<AdminCourse> = [
  {
    id: "crs_01",
    code: "TS-101",
    title: "TypeScript foundations",
    subtitle: "Types, narrowing, generics, and the build pipeline.",
    teacherUserId: "usr_07",
    status: "live",
    capacity: 60,
    enrolled: 54,
    feePerSeat: 4500,
    createdAt: daysAgo(310),
    summary:
      "The flagship curriculum. Twelve modules from variables to conditional types with weekly quizzes and code reviews.",
  },
  {
    id: "crs_02",
    code: "NX-201",
    title: "Next.js App Router in production",
    subtitle: "Server components, caching, and the request memoization model.",
    teacherUserId: "usr_08",
    status: "live",
    capacity: 40,
    enrolled: 38,
    feePerSeat: 5200,
    createdAt: daysAgo(220),
    summary:
      "Project-based track. Students ship a deployed app by week 8 with observability, CI, and end-to-end test coverage.",
  },
  {
    id: "crs_03",
    code: "DB-310",
    title: "Relational databases & PostgreSQL",
    subtitle: "Schema, indexes, migrations, and the cost-based planner.",
    teacherUserId: "usr_09",
    status: "live",
    capacity: 50,
    enrolled: 41,
    feePerSeat: 4800,
    createdAt: daysAgo(180),
    summary:
      "Eight weeks of progressive labs, from a single-table CRUD through window functions and partial indexes.",
  },
  {
    id: "crs_04",
    code: "AI-410",
    title: "AI-assisted engineering",
    subtitle: "Prompt patterns, evals, and shipping LLM features responsibly.",
    teacherUserId: "usr_10",
    status: "live",
    capacity: 30,
    enrolled: 29,
    feePerSeat: 6800,
    createdAt: daysAgo(120),
    summary:
      "Capstone course. Every student submits an AI feature with an eval suite and a one-page risk write-up.",
  },
  {
    id: "crs_05",
    code: "RN-150",
    title: "React Native essentials",
    subtitle: "Navigation, native modules, and a calm release pipeline.",
    teacherUserId: "usr_07",
    status: "draft",
    capacity: 40,
    enrolled: 0,
    feePerSeat: 5000,
    createdAt: daysAgo(20),
    summary:
      "Currently in review. Module outlines, two recorded lectures, and a capstone brief are ready for QA.",
  },
  {
    id: "crs_06",
    code: "DS-220",
    title: "Data structures for interviews",
    subtitle: "Trees, graphs, heaps, and rigorous complexity analysis.",
    teacherUserId: "usr_08",
    status: "live",
    capacity: 45,
    enrolled: 32,
    feePerSeat: 4200,
    createdAt: daysAgo(95),
    summary:
      "Pragmatic data structures. Interview-flavored problem sets with a focus on reading other people's solutions.",
  },
  {
    id: "crs_07",
    code: "CSS-100",
    title: "Modern CSS & design systems",
    subtitle: "Container queries, cascade layers, and accessibility-first theming.",
    teacherUserId: "usr_09",
    status: "archived",
    capacity: 60,
    enrolled: 58,
    feePerSeat: 3500,
    createdAt: daysAgo(720),
    summary:
      "Superseded by the design-systems track. Materials remain available to enrolled students until 2026-06-30.",
  },
  {
    id: "crs_08",
    code: "QA-260",
    title: "Testing & quality engineering",
    subtitle: "Property testing, integration suites, and CI that catches regressions.",
    teacherUserId: "usr_10",
    status: "live",
    capacity: 35,
    enrolled: 27,
    feePerSeat: 5500,
    createdAt: daysAgo(45),
    summary:
      "Hands-on testing track. Students add tests to a real-world open-source codebase as their final project.",
  },
];

// ---------- Students  (5) ----------

export const adminStudents: ReadonlyArray<AdminStudent> = [
  {
    userId: "usr_11",
    rollNumber: "STU-2025-001",
    className: "Senior cohort",
    section: "A",
    fatherName: "Asif Butt",
    motherName: "Nasreen Butt",
    dob: "2006-04-22",
    phoneNumber: "+92 321 5500 121",
    parentPhone: "+92 321 5500 122",
    address: "House 21, Street 4, Lahore",
    feeStatus: "paid",
    enrolledCourseIds: ["crs_01", "crs_02", "crs_03"],
    enrollmentDate: daysAgo(60),
  },
  {
    userId: "usr_12",
    rollNumber: "STU-2025-002",
    className: "Senior cohort",
    section: "A",
    fatherName: "Javed Khan",
    motherName: "Shazia Khan",
    dob: "2006-09-10",
    phoneNumber: "+92 333 7700 211",
    parentPhone: "+92 333 7700 212",
    address: "House 4, Block C, Islamabad",
    feeStatus: "due",
    enrolledCourseIds: ["crs_01", "crs_04"],
    enrollmentDate: daysAgo(58),
  },
  {
    userId: "usr_13",
    rollNumber: "STU-2025-003",
    className: "Senior cohort",
    section: "B",
    fatherName: "Tariq Iqbal",
    motherName: "Rabia Iqbal",
    dob: "2007-01-30",
    phoneNumber: "+92 301 4400 311",
    parentPhone: "+92 301 4400 312",
    address: "House 12, Block 2, Karachi",
    feeStatus: "unpaid",
    enrolledCourseIds: ["crs_02", "crs_03", "crs_06"],
    enrollmentDate: daysAgo(55),
  },
  {
    userId: "usr_14",
    rollNumber: "STU-2025-004",
    className: "Junior cohort",
    section: "A",
    fatherName: "Aslam Hussain",
    motherName: "Sana Aslam",
    dob: "2008-06-18",
    phoneNumber: "+92 345 8800 411",
    parentPhone: "+92 345 8800 412",
    address: "House 33, Garden Town, Lahore",
    feeStatus: "paid",
    enrolledCourseIds: ["crs_01", "crs_06", "crs_08"],
    enrollmentDate: daysAgo(48),
  },
  {
    userId: "usr_15",
    rollNumber: "STU-2025-005",
    className: "Junior cohort",
    section: "B",
    fatherName: "Nadeem Aslam",
    motherName: "Aisha Aslam",
    dob: "2008-11-05",
    phoneNumber: "+92 311 9900 511",
    parentPhone: "+92 311 9900 512",
    address: "House 7, F-7, Islamabad",
    feeStatus: "unpaid",
    enrolledCourseIds: ["crs_03", "crs_08"],
    enrollmentDate: daysAgo(35),
  },
];

// ---------- Teachers  (4) ----------

export const adminTeachers: ReadonlyArray<AdminTeacher> = [
  {
    userId: "usr_07",
    employmentId: "EMP-T-001",
    nic: "35202-1234567-1",
    assignedClass: "Senior A",
    subjectProficiency: ["TypeScript", "React", "Node.js"],
    section: "A",
    dob: "1990-07-12",
    phoneNumber: "+92 300 1111 001",
    address: "House 8, DHA Phase 5, Lahore",
    bio: "Twelve years in production frontend. Specializes in type-driven design and migration of legacy JS to TS.",
    isActive: true,
    hireDate: daysAgo(310),
    assignedCourseIds: ["crs_01", "crs_05"],
  },
  {
    userId: "usr_08",
    employmentId: "EMP-T-002",
    nic: "35202-2345678-2",
    assignedClass: "Senior B",
    subjectProficiency: ["Next.js", "React Native", "Edge runtimes"],
    section: "B",
    dob: "1988-03-25",
    phoneNumber: "+92 300 1111 002",
    address: "House 14, Gulberg III, Lahore",
    bio: "Ex-Staff engineer at a fintech. Teaches the App Router in production with a focus on observability.",
    isActive: true,
    hireDate: daysAgo(280),
    assignedCourseIds: ["crs_02", "crs_06"],
  },
  {
    userId: "usr_09",
    employmentId: "EMP-T-003",
    nic: "35202-3456789-3",
    assignedClass: "Junior A",
    subjectProficiency: ["PostgreSQL", "Data modeling", "PL/pgSQL"],
    section: "A",
    dob: "1992-11-09",
    phoneNumber: "+92 300 1111 003",
    address: "House 22, Bahria Town, Rawalpindi",
    bio: "Database engineer with a clean obsession for indexes. Authored the open-school schema before joining.",
    isActive: true,
    hireDate: daysAgo(240),
    assignedCourseIds: ["crs_03", "crs_07"],
  },
  {
    userId: "usr_10",
    employmentId: "EMP-T-004",
    nic: "35202-4567890-4",
    assignedClass: null,
    subjectProficiency: ["AI tooling", "Evaluation", "Prompt patterns"],
    section: null,
    dob: "1995-02-14",
    phoneNumber: "+92 300 1111 004",
    address: "House 31, Clifton, Karachi",
    bio: "AI engineering lead. Built eval pipelines for two production LLM features. Calm about the hype, sceptical about the demos.",
    isActive: true,
    hireDate: daysAgo(170),
    assignedCourseIds: ["crs_04", "crs_08"],
  },
];

// ---------- Staff  (3) ----------

export const adminStaff: ReadonlyArray<AdminStaff> = [
  {
    userId: "usr_04",
    employmentId: "EMP-S-001",
    nic: "35202-5678901-5",
    department: "Operations",
    designation: "Operations lead",
    phoneNumber: "+92 300 2222 001",
    address: "House 6, Johar Town, Lahore",
    bio: "Runs day-to-day scheduling and the front-desk rotation. Owns the platform attendance policy.",
    isActive: true,
    hireDate: daysAgo(190),
    dob: "1986-05-18",
  },
  {
    userId: "usr_05",
    employmentId: "EMP-S-002",
    nic: "35202-6789012-6",
    department: "Finance",
    designation: "Accountant",
    phoneNumber: "+92 300 2222 002",
    address: "House 9, F-10, Islamabad",
    bio: "Owns tuition billing and the monthly reconciliation cycle. Quiet, exact, organised.",
    isActive: true,
    hireDate: daysAgo(150),
    dob: "1990-09-30",
  },
  {
    userId: "usr_06",
    employmentId: "EMP-S-003",
    nic: "35202-7890123-7",
    department: "Operations",
    designation: "Front desk",
    phoneNumber: "+92 300 2222 003",
    address: "House 1, Model Town, Lahore",
    bio: "First voice on the phone. Currently on a 14-day leave of absence after a conduct review.",
    isActive: false,
    hireDate: daysAgo(120),
    dob: "1993-12-04",
  },
];

// ---------- Enrollments  (derived from students.enrolledCourseIds but augmented with progress) ----------

export const adminEnrollments: ReadonlyArray<AdminEnrollment> = [
  { id: "enr_01", studentUserId: "usr_11", courseId: "crs_01", enrolledAt: daysAgo(60), progressPct: 78 },
  { id: "enr_02", studentUserId: "usr_11", courseId: "crs_02", enrolledAt: daysAgo(58), progressPct: 64 },
  { id: "enr_03", studentUserId: "usr_11", courseId: "crs_03", enrolledAt: daysAgo(56), progressPct: 71 },
  { id: "enr_04", studentUserId: "usr_12", courseId: "crs_01", enrolledAt: daysAgo(58), progressPct: 55 },
  { id: "enr_05", studentUserId: "usr_12", courseId: "crs_04", enrolledAt: daysAgo(40), progressPct: 41 },
  { id: "enr_06", studentUserId: "usr_13", courseId: "crs_02", enrolledAt: daysAgo(55), progressPct: 82 },
  { id: "enr_07", studentUserId: "usr_13", courseId: "crs_03", enrolledAt: daysAgo(54), progressPct: 48 },
  { id: "enr_08", studentUserId: "usr_13", courseId: "crs_06", enrolledAt: daysAgo(30), progressPct: 36 },
  { id: "enr_09", studentUserId: "usr_14", courseId: "crs_01", enrolledAt: daysAgo(48), progressPct: 67 },
  { id: "enr_10", studentUserId: "usr_14", courseId: "crs_06", enrolledAt: daysAgo(28), progressPct: 52 },
  { id: "enr_11", studentUserId: "usr_14", courseId: "crs_08", enrolledAt: daysAgo(18), progressPct: 22 },
  { id: "enr_12", studentUserId: "usr_15", courseId: "crs_03", enrolledAt: daysAgo(35), progressPct: 49 },
  { id: "enr_13", studentUserId: "usr_15", courseId: "crs_08", enrolledAt: daysAgo(15), progressPct: 18 },
];

// ---------- Fee records  (3 months x 5 students = 15) ----------

export const feeRecords: ReadonlyArray<FeeRecord> = [
  // November
  { id: "fee_01", studentUserId: "usr_11", monthLabel: "Nov 2025", amount: 14500, status: "paid",   paidOn: daysAgo(35), updatedAt: daysAgo(35) },
  { id: "fee_02", studentUserId: "usr_12", monthLabel: "Nov 2025", amount: 11600, status: "paid",   paidOn: daysAgo(30), updatedAt: daysAgo(30) },
  { id: "fee_03", studentUserId: "usr_13", monthLabel: "Nov 2025", amount: 14200, status: "paid",   paidOn: daysAgo(28), updatedAt: daysAgo(28) },
  { id: "fee_04", studentUserId: "usr_14", monthLabel: "Nov 2025", amount: 13200, status: "paid",   paidOn: daysAgo(26), updatedAt: daysAgo(26) },
  { id: "fee_05", studentUserId: "usr_15", monthLabel: "Nov 2025", amount: 10300, status: "due",    paidOn: null,     updatedAt: daysAgo(8) },
  // December
  { id: "fee_06", studentUserId: "usr_11", monthLabel: "Dec 2025", amount: 14500, status: "paid",   paidOn: daysAgo(10), updatedAt: daysAgo(10) },
  { id: "fee_07", studentUserId: "usr_12", monthLabel: "Dec 2025", amount: 11600, status: "due",    paidOn: null,     updatedAt: daysAgo(7) },
  { id: "fee_08", studentUserId: "usr_13", monthLabel: "Dec 2025", amount: 14200, status: "unpaid", paidOn: null,     updatedAt: daysAgo(20) },
  { id: "fee_09", studentUserId: "usr_14", monthLabel: "Dec 2025", amount: 13200, status: "paid",   paidOn: daysAgo(11), updatedAt: daysAgo(11) },
  { id: "fee_10", studentUserId: "usr_15", monthLabel: "Dec 2025", amount: 10300, status: "due",    paidOn: null,     updatedAt: daysAgo(2) },
  // January (current)
  { id: "fee_11", studentUserId: "usr_11", monthLabel: "Jan 2026", amount: 14500, status: "paid",   paidOn: daysAgo(2),  updatedAt: daysAgo(2) },
  { id: "fee_12", studentUserId: "usr_12", monthLabel: "Jan 2026", amount: 11600, status: "unpaid", paidOn: null,     updatedAt: daysAgo(1) },
  { id: "fee_13", studentUserId: "usr_13", monthLabel: "Jan 2026", amount: 14200, status: "unpaid", paidOn: null,     updatedAt: daysAgo(1) },
  { id: "fee_14", studentUserId: "usr_14", monthLabel: "Jan 2026", amount: 13200, status: "paid",   paidOn: daysAgo(1),  updatedAt: daysAgo(1) },
  { id: "fee_15", studentUserId: "usr_15", monthLabel: "Jan 2026", amount: 10300, status: "unpaid", paidOn: null,     updatedAt: daysAgo(1) },
];

// ---------- Announcements ----------

export const adminAnnouncements: ReadonlyArray<AdminAnnouncement> = [
  {
    id: "ann_01",
    title: "Spring enrollment window now open",
    body: "Open enrollment for the spring 2026 cohort runs until 28 February. Course caps are listed on each course page.",
    target: "all",
    pinned: true,
    publishedAt: daysAgo(4),
    authorUserId: "usr_01",
  },
  {
    id: "ann_02",
    title: "Fee reconciliation deadline — 25 Jan",
    body: "All tuition balances for January must clear by 25 Jan. Contact the finance desk if you need a payment plan.",
    target: "students",
    pinned: true,
    publishedAt: daysAgo(7),
    authorUserId: "usr_05",
  },
  {
    id: "ann_03",
    title: "Quarterly planning session — Friday 2pm",
    body: "All teachers meet in Hall B on Friday at 2pm to review the Q1 roadmap. Lunch is provided.",
    target: "teachers",
    pinned: false,
    publishedAt: daysAgo(3),
    authorUserId: "usr_02",
  },
  {
    id: "ann_04",
    title: "Front desk rotation: new schedule",
    body: "The updated front desk rotation kicks off on Monday. Adeel will publish the printed sheet tomorrow.",
    target: "staff",
    pinned: false,
    publishedAt: daysAgo(2),
    authorUserId: "usr_04",
  },
  {
    id: "ann_05",
    title: "Platform maintenance: Sunday 02:00–04:00 UTC",
    body: "Reports and exports will be unavailable for 15 minutes during the maintenance window.",
    target: "all",
    pinned: false,
    publishedAt: daysAgo(1),
    authorUserId: "usr_03",
  },
];

// ============================================================
// Derived selectors
// ============================================================

export function findUser(id: string): AdminUser | null {
  return adminUsers.find((u) => u.id === id) ?? null;
}

export function findStudent(userId: string): AdminStudent | null {
  return adminStudents.find((s) => s.userId === userId) ?? null;
}

export function findTeacher(userId: string): AdminTeacher | null {
  return adminTeachers.find((t) => t.userId === userId) ?? null;
}

export function findStaff(userId: string): AdminStaff | null {
  return adminStaff.find((s) => s.userId === userId) ?? null;
}

export function findCourse(id: string): AdminCourse | null {
  return adminCourses.find((c) => c.id === id) ?? null;
}

export function findAnnouncement(id: string): AdminAnnouncement | null {
  return adminAnnouncements.find((a) => a.id === id) ?? null;
}

// Counts used on the overview page
export function countsByRole(): Record<AdminRole, number> {
  const acc: Record<AdminRole, number> = {
    superAdmin: 0,
    admin: 0,
    staff: 0,
    teacher: 0,
    student: 0,
  };
  for (const u of adminUsers) acc[u.role] += 1;
  return acc;
}

export function feeSummary(): {
  paid: number;
  unpaid: number;
  due: number;
  collectedPkr: number;
} {
  let paid = 0;
  let unpaid = 0;
  let due = 0;
  let collectedPkr = 0;
  for (const r of feeRecords) {
    if (r.status === "paid") {
      paid += 1;
      collectedPkr += r.amount;
    } else if (r.status === "unpaid") unpaid += 1;
    else due += 1;
  }
  return { paid, unpaid, due, collectedPkr };
}

// ---- KPIs for overview page  ----
export const adminOverviewKpis: ReadonlyArray<AdminKpi> = [
  { label: "Students", value: "5", delta: "+2 this month", trend: "up", hint: "Active enrolled students" },
  { label: "Teachers", value: "4", hint: "Across 8 courses" },
  { label: "Staff", value: "3", delta: "1 on leave", trend: "flat" },
  { label: "Courses", value: "8", delta: "+1 draft", trend: "up", hint: "6 live · 1 draft · 1 archived" },
];

// ---- Recent activity feed for overview ----
export const adminOverviewActivity: ReadonlyArray<AdminActivityEntry> = [
  { id: "act_01", actor: "Areeba Khan", verb: "paid tuition for", target: "Jan 2026", at: "12 min ago" },
  { id: "act_02", actor: "Saad Iqbal", verb: "enrolled in", target: "DS-220 · Data structures", at: "1h ago" },
  { id: "act_03", actor: "Ayesha Siddiqui", verb: "published grades for", target: "TS-101 · Module 4", at: "3h ago" },
  { id: "act_04", actor: "Mariam Suleman", verb: "reconciled fees for", target: "December cycle", at: "yesterday" },
  { id: "act_05", actor: "Bilal Ashraf", verb: "archived course", target: "CSS-100", at: "2 days ago" },
  { id: "act_06", actor: "Salman Khan", verb: "promoted", target: "Hina Karim to admin", at: "3 days ago" },
];

// ---- Settings seed ----

export type PlatformSettings = {
  readonly platformName: string;
  readonly academicYear: string;
  readonly contactEmail: string;
  readonly defaultLanguage: "en" | "ur";
  readonly maintenanceMode: boolean;
  readonly allowSelfSignup: boolean;
  readonly maxCourseCapacity: number;
};

export const platformSettings: PlatformSettings = {
  platformName: "LearnHub",
  academicYear: "2025-2026",
  contactEmail: "admin@learnhub.test",
  defaultLanguage: "en",
  maintenanceMode: false,
  allowSelfSignup: true,
  maxCourseCapacity: 80,
};
