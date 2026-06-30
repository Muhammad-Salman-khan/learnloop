export type Role = "student" | "teacher" | "staff" | "admin" | "superAdmin";

export type UserStatus = "active" | "banned" | "suspended";

export type StudentStatus = "active" | "inactive" | "graduated" | "suspended";
export type TeacherStatus = "active" | "inactive" | "onLeave";
export type StaffStatus = "active" | "inactive" | "onLeave";
export type AdminStatus = "active" | "inactive" | "onLeave";

export interface FakeUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role | string;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  phone: string | null;
  address: string | null;
}

export interface FakeStudent extends FakeUser {
  studentId: string;
  rollNumber: string;
  class: string;
  section: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string | null;
  enrollmentDate: Date;
  studentStatus: StudentStatus;
  courses: string[];
  gpa: number;
  attendancePercentage: number;
}

export interface FakeTeacher extends FakeUser {
  teacherId: string;
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: Date;
  qualification: string;
  experience: number;
  subjects: string[];
  courses: string[];
  teacherStatus: TeacherStatus;
  rating: number;
}

export interface FakeStaff extends FakeUser {
  staffId: string;
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: Date;
  staffStatus: StaffStatus;
  shift: "morning" | "evening" | "night";
}

export interface FakeAdmin extends FakeUser {
  adminId: string;
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: Date;
  adminStatus: AdminStatus;
  lastActivityAt: Date | null;
}

export interface FakeCourse {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  instructorId: string | null;
  instructorName: string | null;
  schedule: string;
  duration: string;
  capacity: number;
  enrolled: number;
  status: "active" | "draft" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export interface FakeBatch {
  id: string;
  name: string;
  code: string;
  year: number;
  startDate: Date;
  endDate: Date;
  courseCount: number;
  studentCount: number;
  status: "active" | "completed" | "upcoming";
  createdAt: Date;
}

export interface FakeEnrollment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  enrollmentDate: Date;
  status: "active" | "completed" | "dropped" | "pending";
  grade: string | null;
  createdAt: Date;
}

export interface FakeSchedule {
  id: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  type: "lecture" | "lab" | "seminar";
  status: "active" | "cancelled" | "rescheduled";
}

export interface FakeFeeStructure {
  id: string;
  name: string;
  description: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "yearly" | "one-time";
  applicableFor: string[];
  dueDay: number;
  lateFee: number;
  status: "active" | "inactive";
  createdAt: Date;
}

export interface FakeFeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  structureId: string;
  structureName: string;
  amount: number;
  paidAmount: number;
  dueDate: Date;
  paidDate: Date | null;
  status: "paid" | "pending" | "overdue" | "partial";
  createdAt: Date;
}

export interface FakeAttendance {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: Date;
  status: "present" | "absent" | "late" | "excused";
  notes: string | null;
  markedBy: string;
}

export interface FakeResult {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  examType: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks: string | null;
  publishedAt: Date;
  status: "published" | "draft" | "withheld";
}

export interface FakeAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  targetAudience: string[];
  priority: "low" | "medium" | "high" | "urgent";
  startDate: Date;
  endDate: Date | null;
  status: "active" | "draft" | "archived";
  views: number;
  createdAt: Date;
}

export interface FakeNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  targetRole: string[];
  sentAt: Date;
  readCount: number;
  totalTargets: number;
  status: "sent" | "scheduled" | "draft";
}

export interface FakeAuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string | null;
  targetType: string | null;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface FakeRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: Date;
}

export interface FakeSystemSetting {
  id: string;
  category: string;
  key: string;
  value: string;
  description: string;
  updatedAt: Date;
  updatedBy: string;
}
