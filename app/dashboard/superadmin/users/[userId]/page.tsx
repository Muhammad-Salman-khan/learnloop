import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { findUserById } from "@/lib/superadmin/data";
import {
  ALL_ROLES,
  roleBadgeVariant,
  roleLabel,
  type SuperadminRole,
} from "@/lib/superadmin/roles";

const page = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;
  const user = await findUserById(userId);
  if (!user) notFound();

  const role = user.role as SuperadminRole;
  const profile = user.student ?? user.teacher ?? user.staff ?? null;
  const profileKind = user.student
    ? "Student"
    : user.teacher
      ? "Teacher"
      : user.staff
        ? "Staff"
        : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Super-admin · User
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            {user.name}
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/superadmin/users/${user.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/superadmin/users/${user.id}/ban`}>
              {user.banned ? "Manage ban" : "Ban"}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/superadmin/users/${user.id}/activity`}>Activity</Link>
          </Button>
          {role !== "superAdmin" ? (
            <Button size="sm" asChild>
              <Link href={`/dashboard/superadmin/users/${user.id}/impersonate`}>
                Impersonate
              </Link>
            </Button>
          ) : null}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
              Role
            </CardDescription>
            <CardTitle className="font-display text-base">
              <Badge variant={ALL_ROLES.includes(role) ? roleBadgeVariant(role) : "secondary"}>
                {ALL_ROLES.includes(role) ? roleLabel(role) : user.role}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Determines which dashboard the user is routed to on next sign-in.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
              Status
            </CardDescription>
            <CardTitle className="font-display text-base">
              {user.banned ? (
                <Badge variant="destructive">Banned</Badge>
              ) : (
                <Badge variant="secondary">Active</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {user.banned
              ? user.banReason ?? "Banned. See ban page for details."
              : "Account is allowed to sign in."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
              Joined
            </CardDescription>
            <CardTitle className="font-display text-base">
              {user.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Email verification:{" "}
            {(user as unknown as { emailVerified?: boolean }).emailVerified
              ? "Verified"
              : "Pending"}
            .
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Profile record
          </CardTitle>
          <CardDescription className="text-xs">
            {profileKind
              ? `${profileKind} profile fields linked via User.id`
              : "No profile row — office-only / staff-on-record is missing."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!profile ? (
            <p className="rounded-md border bg-muted/30 p-4 text-xs text-muted-foreground">
              This user has no Student / Teacher / Staff profile yet. Use the
              New action on the relevant role to create one.
            </p>
          ) : (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
              {Object.entries(profile)
                .filter(([k]) => k !== "id" && k !== "user")
                .map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5">
                    <dt className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="font-mono">
                      {v === null || v === undefined
                        ? "—"
                        : typeof v === "string" && v.length > 64
                          ? v.slice(0, 60) + "…"
                          : String(v)}
                    </dd>
                  </div>
                ))}
            </dl>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <Link
          href="/dashboard/superadmin/users"
          className="text-muted-foreground hover:underline"
        >
          ← All users
        </Link>
        <code className="font-mono text-[10.5px] text-muted-foreground">
          id: {user.id}
        </code>
      </div>
    </div>
  );
};

export default page;
