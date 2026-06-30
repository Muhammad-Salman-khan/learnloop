"use server";

// Superadmin server actions.
// Every mutation:
//   1. calls auth.api.getSession()
//   2. rejects everyone who isn't superAdmin
//   3. executes against prisma
//   4. calls recordAudit(...)
//   5. calls revalidatePath() so the affected page re-renders.

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { recordAudit } from "@/lib/superadmin/audit";
import type { SuperadminRole } from "@/lib/superadmin/roles";
import { ALL_ROLES } from "@/lib/superadmin/roles";

async function requireSuperAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "superAdmin") {
    throw new Error("forbidden");
  }
  return session.user;
}

export async function setUserRole(userId: string, role: SuperadminRole) {
  const me = await requireSuperAdmin();
  if (!ALL_ROLES.includes(role)) throw new Error("invalid role");
  if (userId === me.id) throw new Error("cannot change your own role");
  await prisma.user.update({ where: { id: userId }, data: { role } });
  await recordAudit({
    actorId: me.id,
    action: role === "superAdmin" ? "user.role.promote" : "user.role.demote",
    target: userId,
    meta: { newRole: role },
  });
  revalidatePath(`/dashboard/superadmin/users/${userId}`);
  revalidatePath("/dashboard/superadmin/users");
  revalidatePath("/dashboard/superadmin/roles");
}

export async function banUser(args: {
  userId: string;
  reason: string;
  expiresAt: string | null;
}) {
  const me = await requireSuperAdmin();
  if (args.userId === me.id) throw new Error("cannot ban yourself");
  const expires = args.expiresAt ? new Date(args.expiresAt) : null;
  await prisma.user.update({
    where: { id: args.userId },
    data: {
      banned: true,
      banReason: args.reason,
      banExpires: expires,
    },
  });
  await recordAudit({
    actorId: me.id,
    action: "user.ban",
    target: args.userId,
    meta: { reason: args.reason, expiresAt: expires?.toISOString() ?? null },
  });
  revalidatePath(`/dashboard/superadmin/users/${args.userId}`);
  revalidatePath("/dashboard/superadmin/users");
}

export async function unbanUser(userId: string) {
  const me = await requireSuperAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { banned: false, banReason: null, banExpires: null },
  });
  await recordAudit({
    actorId: me.id,
    action: "user.unban",
    target: userId,
  });
  revalidatePath(`/dashboard/superadmin/users/${userId}`);
  revalidatePath("/dashboard/superadmin/users");
}

export async function startImpersonation(userId: string) {
  const me = await requireSuperAdmin();
  if (userId === me.id) throw new Error("cannot impersonate yourself");
  await auth.api.impersonateUser({
    body: { userId: userId as unknown as never, expiresIn: 60 * 60 } as never,
    headers: await headers(),
  });
  await recordAudit({
    actorId: me.id,
    action: "impersonation.start",
    target: userId,
  });
  revalidatePath("/dashboard/superadmin");
}

export async function stopImpersonation() {
  const me = await requireSuperAdmin();
  await auth.api.stopImpersonating({ headers: await headers() });
  await recordAudit({
    actorId: me.id,
    action: "impersonation.end",
  });
  revalidatePath("/dashboard/superadmin");
}

// ============================================================
// Staff
// ============================================================

export async function createStaffAccount(args: {
  email: string;
  password: string;
  name: string;
}) {
  const me = await requireSuperAdmin();
  await auth.api.signUpEmail({
    body: { email: args.email, password: args.password, name: args.name },
    headers: await headers(),
  });
  const newUser = await prisma.user.findFirst({
    where: { email: args.email },
    orderBy: { createdAt: "desc" },
  });
  if (!newUser) throw new Error("user creation failed");
  await prisma.user.update({
    where: { id: newUser.id },
    data: { role: "staff" },
  });
  await prisma.staff.create({
    data: { id: newUser.id, hireDate: new Date(), isActive: true },
  });
  await recordAudit({
    actorId: me.id,
    action: "staff.create",
    target: newUser.id,
    meta: { email: args.email },
  });
  revalidatePath("/dashboard/superadmin/staff");
}

export async function updateStaff(args: {
  staffId: string;
  employmentId?: string;
  nic?: string;
  department?: string;
  designation?: string;
  phoneNumber?: string;
  address?: string;
  isActive?: boolean;
  bio?: string;
}) {
  const me = await requireSuperAdmin();
  await prisma.staff.update({
    where: { id: args.staffId },
    data: {
      employmentId: args.employmentId ?? null,
      nic: args.nic ?? null,
      department: args.department ?? null,
      designation: args.designation ?? null,
      phoneNumber: args.phoneNumber ?? null,
      address: args.address ?? null,
      isActive: args.isActive ?? true,
      bio: args.bio ?? null,
    },
  });
  await recordAudit({
    actorId: me.id,
    action: "staff.update",
    target: args.staffId,
  });
  revalidatePath(`/dashboard/superadmin/staff/${args.staffId}`);
  revalidatePath("/dashboard/superadmin/staff");
}

export async function deleteStaff(staffId: string) {
  const me = await requireSuperAdmin();
  await prisma.staff.delete({ where: { id: staffId } }).catch(() => null);
  await prisma.user.delete({ where: { id: staffId } }).catch(() => null);
  await recordAudit({
    actorId: me.id,
    action: "staff.delete",
    target: staffId,
  });
  revalidatePath("/dashboard/superadmin/staff");
}

// ============================================================
// Admin
// ============================================================

export async function createAdminAccount(args: {
  email: string;
  password: string;
  name: string;
}) {
  const me = await requireSuperAdmin();
  await auth.api.signUpEmail({
    body: { email: args.email, password: args.password, name: args.name },
    headers: await headers(),
  });
  const newUser = await prisma.user.findFirst({
    where: { email: args.email },
    orderBy: { createdAt: "desc" },
  });
  if (!newUser) throw new Error("user creation failed");
  await prisma.user.update({
    where: { id: newUser.id },
    data: { role: "admin" },
  });
  await recordAudit({
    actorId: me.id,
    action: "admin.create",
    target: newUser.id,
    meta: { email: args.email },
  });
  revalidatePath("/dashboard/superadmin/admins");
}

export async function deleteAdmin(adminId: string) {
  const me = await requireSuperAdmin();
  if (adminId === me.id) throw new Error("cannot delete yourself");
  await prisma.user.delete({ where: { id: adminId } }).catch(() => null);
  await recordAudit({
    actorId: me.id,
    action: "admin.delete",
    target: adminId,
  });
  revalidatePath("/dashboard/superadmin/admins");
}

// ============================================================
// Student / Teacher / User generic edits
// ============================================================

export async function updateUser(args: {
  userId: string;
  name?: string;
  email?: string;
}) {
  const me = await requireSuperAdmin();
  await prisma.user.update({
    where: { id: args.userId },
    data: { name: args.name, email: args.email },
  });
  await recordAudit({
    actorId: me.id,
    action: "user.update",
    target: args.userId,
    meta: { name: args.name, email: args.email },
  });
  revalidatePath(`/dashboard/superadmin/users/${args.userId}`);
}

export async function createUser(args: {
  email: string;
  password: string;
  name: string;
  role: SuperadminRole;
}) {
  const me = await requireSuperAdmin();
  await auth.api.signUpEmail({
    body: { email: args.email, password: args.password, name: args.name },
    headers: await headers(),
  });
  const newUser = await prisma.user.findFirst({
    where: { email: args.email },
    orderBy: { createdAt: "desc" },
  });
  if (!newUser) throw new Error("user creation failed");
  await prisma.user.update({
    where: { id: newUser.id },
    data: { role: args.role },
  });
  if (args.role === "student") {
    await prisma.student.create({
      data: { id: newUser.id, class: "Unassigned", dob: new Date(2000, 0, 1) },
    });
  } else if (args.role === "teacher") {
    await prisma.teacher.create({
      data: { id: newUser.id, hireDate: new Date(), dob: new Date(1990, 0, 1), isActive: true },
    });
  } else if (args.role === "staff") {
    await prisma.staff.create({
      data: { id: newUser.id, hireDate: new Date(), isActive: true },
    });
  }
  await recordAudit({
    actorId: me.id,
    action: "user.create",
    target: newUser.id,
    meta: { email: args.email, role: args.role },
  });
  revalidatePath("/dashboard/superadmin/users");
}

export async function updateStudent(args: {
  studentId: string;
  rollNumber?: string;
  class?: string;
  section?: string;
  fatherName?: string;
  motherName?: string;
  phoneNumber?: string;
  parentPhone?: string;
  address?: string;
  bio?: string;
}) {
  const me = await requireSuperAdmin();
  await prisma.student.update({
    where: { id: args.studentId },
    data: {
      rollNumber: args.rollNumber ?? null,
      class: args.class,
      section: args.section ?? null,
      fatherName: args.fatherName ?? null,
      motherName: args.motherName ?? null,
      phoneNumber: args.phoneNumber ?? null,
      parentPhone: args.parentPhone ?? null,
      address: args.address ?? null,
      bio: args.bio ?? null,
    },
  });
  await recordAudit({
    actorId: me.id,
    action: "student.update",
    target: args.studentId,
  });
  revalidatePath(`/dashboard/superadmin/students/${args.studentId}`);
}

export async function updateTeacher(args: {
  teacherId: string;
  employmentId?: string;
  nic?: string;
  assgin_class?: string;
  section?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  isActive?: boolean;
}) {
  const me = await requireSuperAdmin();
  await prisma.teacher.update({
    where: { id: args.teacherId },
    data: {
      employmentId: args.employmentId ?? null,
      nic: args.nic ?? null,
      assgin_class: args.assgin_class ?? null,
      section: args.section ?? null,
      phoneNumber: args.phoneNumber ?? null,
      address: args.address ?? null,
      bio: args.bio ?? null,
      isActive: args.isActive ?? true,
    },
  });
  await recordAudit({
    actorId: me.id,
    action: "teacher.update",
    target: args.teacherId,
  });
  revalidatePath(`/dashboard/superadmin/teachers/${args.teacherId}`);
}
