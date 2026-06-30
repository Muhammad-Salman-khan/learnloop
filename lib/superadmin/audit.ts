// Server-side audit log helper.
// Every superadmin mutation should call `recordAudit(...)` so the
// /dashboard/superadmin/audit-log page has real data to render.

import prisma from "@/lib/prisma";
export type AuditAction =
  | "user.create"
  | "user.update"
  | "user.ban"
  | "user.unban"
  | "user.delete"
  | "user.role.promote"
  | "user.role.demote"
  | "impersonation.start"
  | "impersonation.end"
  | "student.update"
  | "teacher.update"
  | "staff.create"
  | "staff.update"
  | "staff.delete"
  | "admin.create"
  | "admin.update"
  | "admin.delete"
  | "settings.update";

export async function recordAudit(args: {
  actorId: string;
  action: AuditAction;
  target?: string | null;
  meta?: Record<string, unknown>;
}) {
  await (prisma as unknown as { auditEvent: { create: (args: { data: Record<string, unknown> }) => Promise<unknown> } }).auditEvent.create({
    data: {
      actorId: args.actorId,
      action: args.action,
      target: args.target ?? null,
      meta: (args?.meta ?? undefined) as never,
    },
  });
}

export type AuditLogEntry = {
  id: string;
  actorId: string;
  action: string;
  target: string | null;
  meta: unknown;
  createdAt: Date;
};

export async function listAuditEvents(args?: {
  actorId?: string;
  action?: string;
  q?: string;
  take?: number;
  skip?: number;
}) {
  const audit = prisma as unknown as {
    auditEvent: {
      findMany: (args: Record<string, unknown>) => Promise<AuditLogEntry[]>;
    };
  };
  return audit.auditEvent.findMany({
    where: {
      actorId: args?.actorId,
      action: args?.action,
      ...(args?.q
        ? { OR: [{ action: { contains: args.q, mode: "insensitive" } }, { target: { contains: args.q, mode: "insensitive" } }] }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: args?.take ?? 100,
    skip: args?.skip ?? 0,
  });
}
