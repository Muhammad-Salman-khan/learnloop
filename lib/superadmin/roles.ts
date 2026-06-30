// Role helper for the superadmin dashboard.
// Wraps the Prisma `role` enum (camelCase) into a typed label set
// shared across every page under /dashboard/superadmin/*.

export const SUPERADMIN_ROLES = [
  "superAdmin",
  "admin",
  "staff",
  "teacher",
  "student",
] as const;

export type SuperadminRole = (typeof SUPERADMIN_ROLES)[number];

export const ALL_ROLES: ReadonlyArray<SuperadminRole> = SUPERADMIN_ROLES;

export function roleLabel(role: SuperadminRole): string {
  if (role === "superAdmin") return "Super admin";
  return role[0]!.toUpperCase() + role.slice(1);
}

export function roleBadgeVariant(role: SuperadminRole) {
  if (role === "superAdmin") return "default" as const;
  if (role === "admin") return "secondary" as const;
  if (role === "teacher") return "outline" as const;
  if (role === "staff") return "ghost" as const;
  return "secondary" as const;
}

export function isSuperAdminRole(role: string): role is "superAdmin" {
  return role === "superAdmin";
}
