// Server-side data layer for the superadmin dashboard.
// All reads come from Prisma against the live database. Writes go
// through Server Actions in app/actions/superadmin/* and audit-log
// themselves via recordAudit().

import prisma from "@/lib/prisma";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const userSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  banned: true,
  banReason: true,
  banExpires: true,
  createdAt: true,
  updatedAt: true,
} satisfies Record<string, unknown>;

export async function listUsers(args?: {
  role?: string;
  q?: string;
  banned?: boolean | null;
}) {
  return prisma.user.findMany({
    where: {
      ...(args?.role && args.role !== "all"
        ? ({ role: args.role as never } as Record<string, unknown>)
        : {}),
      ...(args?.banned === true ? { banned: true } : {}),
      ...(args?.banned === false ? { banned: false } : {}),
      ...(args?.q
        ? {
            OR: [
              { name: { contains: args.q, mode: "insensitive" } },
              { email: { contains: args.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ banned: "asc" }, { createdAt: "desc" }],
    select: userSelect,
    take: 500,
  });
}

export async function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { ...userSelect, student: true, teacher: true, staff: true },
  });
}

export async function countsByRole() {
  const rows = await prisma.user.groupBy({
    by: ["role"],
    _count: { _all: true },
  });
  return rows.map((r) => ({ role: r.role, count: r._count._all }));
}

export async function bannedCounts() {
  const [banned, total] = await Promise.all([
    prisma.user.count({ where: { banned: true } }),
    prisma.user.count(),
  ]);
  return { banned, total, active: total - banned };
}

export async function signupsByDay(days = 14) {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (days - 1));
  const users = await prisma.user.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });
  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const u of users) {
    const key = u.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([day, count]) => ({ day, count }));
}

export async function countsAcrossAll() {
  const [users, students, teachers, staff] = await Promise.all([
    prisma.user.count(),
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.staff.count(),
  ]);
  return { users, students, teachers, staff };
}

export async function findStudentByUserId(userId: string) {
  return prisma.student.findUnique({ where: { id: userId } });
}

export async function findTeacherByUserId(userId: string) {
  return prisma.teacher.findUnique({ where: { id: userId } });
}

export async function findStaffByUserId(userId: string) {
  return prisma.staff.findUnique({ where: { id: userId } });
}

export async function listStudents(args?: { q?: string; class?: string }) {
  const users = await prisma.user.findMany({
    where: {
      role: "student",
      ...(args?.q
        ? {
            OR: [
              { name: { contains: args.q, mode: "insensitive" } },
              { email: { contains: args.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: { ...userSelect, student: true },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  return users.filter((u) => args?.class ? u.student?.class === args.class : true);
}

export async function listTeachers(args?: { q?: string }) {
  return prisma.user.findMany({
    where: {
      role: "teacher",
      ...(args?.q
        ? {
            OR: [
              { name: { contains: args.q, mode: "insensitive" } },
              { email: { contains: args.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: { ...userSelect, teacher: true },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
}

export async function listStaff(args?: { q?: string }) {
  return prisma.user.findMany({
    where: {
      role: "staff",
      ...(args?.q
        ? {
            OR: [
              { name: { contains: args.q, mode: "insensitive" } },
              { email: { contains: args.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: { ...userSelect, staff: true },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
}

export async function listAdmins(args?: { q?: string }) {
  return prisma.user.findMany({
    where: {
      role: { in: ["admin", "superAdmin"] },
      ...(args?.q
        ? {
            OR: [
              { name: { contains: args.q, mode: "insensitive" } },
              { email: { contains: args.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: userSelect,
    orderBy: { createdAt: "desc" },
    take: 500,
  });
}
