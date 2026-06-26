import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  AtSign,
  Ban,
  CheckCircle2,
  Pencil,
  ShieldCheck,
} from "lucide-react";

import {
  findUser,
  findStudent,
  findTeacher,
  findStaff,
  adminAnnouncements,
  roleLabel,
} from "@/lib/admin/admin-data";
import type { AdminRole } from "@/lib/admin/admin-data";
import { formatDateLong, relativeTime } from "@/lib/admin/formatters";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

import { UserBanActions } from "@/components/UserBanActions/UserBanActions";

const DetailRow = ({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) => (
  <div className="flex flex-col gap-0.5 border-b py-2.5 last:border-b-0">
    <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </span>
    <span className="text-sm">{value}</span>
  </div>
);

const roleBadgeVariant = (role: AdminRole) => {
  if (role === "superAdmin")
    return "default" as const;
  if (role === "admin")
    return "secondary" as const;
  if (role === "teacher")
    return "outline" as const;
  if (role === "staff")
    return "ghost" as const;
  return "secondary" as const;
};

const page = ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  return params.then(async ({ userId }) => {
    const user = findUser(userId);
    if (!user) notFound();

    const student = findStudent(userId);
    const teacher = findTeacher(userId);
    const staff = findStaff(userId);

    // Filter announcements authored by this user for a small attribution card.
    const authored = adminAnnouncements
      .filter((a) => a.authorUserId === user.id)
      .slice(0, 4);

    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/admin/users">
              <ArrowLeft className="size-3.5" />
              Back to all users
            </Link>
          </Button>
          <Button size="sm" asChild className="gap-1.5">
            <Link href={`/dashboard/admin/users/${user.id}/edit`}>
              <Pencil className="size-3.5" />
              Edit profile
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
              <Avatar className="size-20 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary text-xl text-primary-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n.charAt(0).toUpperCase())
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                    {user.name}
                  </h1>
                  <Badge variant={roleBadgeVariant(user.role)}>
                    {roleLabel(user.role)}
                  </Badge>
                  {user.banned ? (
                    <Badge variant="destructive" className="gap-1">
                      <Ban className="size-2.5" /> Banned
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="size-2.5" /> Active
                    </Badge>
                  )}
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <AtSign className="size-3.5" />
                  {user.email}
                </span>
                <span className="text-xs text-muted-foreground">
                  Last seen {relativeTime(user.lastSeenAt)} · joined{" "}
                  {formatDateLong(user.createdAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Account
              </CardTitle>
              <CardDescription className="text-xs">
                Identity, role, and access controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-x-6">
              <div>
                <DetailRow label="User ID" value={user.id} />
                <DetailRow label="Name" value={user.name} />
                <DetailRow label="Email" value={user.email} />
                <DetailRow
                  label="Role"
                  value={roleLabel(user.role)}
                />
              </div>
              <div>
                <DetailRow label="Banned" value={user.banned ? "Yes" : "No"} />
                <DetailRow
                  label="Ban reason"
                  value={user.banReason ?? "—"}
                />
                <DetailRow
                  label="Ban expires"
                  value={
                    user.banExpires
                      ? formatDateLong(user.banExpires)
                      : "—"
                  }
                />
                <DetailRow
                  label="Created"
                  value={formatDateLong(user.createdAt)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Ban controls
              </CardTitle>
              <CardDescription className="text-xs">
                Banning instantly signs the user out of every device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserBanActions
                userId={user.id}
                banned={user.banned}
                banReason={user.banReason ?? null}
              />
            </CardContent>
          </Card>
        </div>

        {(student || teacher || staff) && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Linked profile
              </CardTitle>
              <CardDescription className="text-xs">
                This user&apos;s role-specific record in LearnHub.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {student ? (
                <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                  <DetailRow
                    label="Roll number"
                    value={student.rollNumber}
                  />
                  <DetailRow
                    label="Class"
                    value={`${student.className} · Section ${student.section}`}
                  />
                  <DetailRow
                    label="Father name"
                    value={student.fatherName}
                  />
                  <DetailRow
                    label="Mother name"
                    value={student.motherName}
                  />
                  <DetailRow
                    label="Phone"
                    value={student.phoneNumber}
                  />
                  <DetailRow
                    label="Parent phone"
                    value={student.parentPhone}
                  />
                  <DetailRow
                    label="Enrolled courses"
                    value={`${student.enrolledCourseIds.length} courses`}
                  />
                  <DetailRow
                    label="Fee status"
                    value={student.feeStatus.toUpperCase()}
                  />
                  <div className="md:col-span-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/dashboard/admin/students/${user.id}`}
                      >
                        Open student profile →
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : teacher ? (
                <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                  <DetailRow
                    label="Employment ID"
                    value={teacher.employmentId}
                  />
                  <DetailRow
                    label="Assigned class"
                    value={teacher.assignedClass ?? "—"}
                  />
                  <DetailRow
                    label="Subjects"
                    value={teacher.subjectProficiency.join(", ")}
                  />
                  <DetailRow
                    label="Phone"
                    value={teacher.phoneNumber}
                  />
                  <DetailRow
                    label="Status"
                    value={teacher.isActive ? "Active" : "Inactive"}
                  />
                  <DetailRow
                    label="Courses assigned"
                    value={`${teacher.assignedCourseIds.length} courses`}
                  />
                  <div className="md:col-span-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/dashboard/admin/teachers/${user.id}`}
                      >
                        Open teacher profile →
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : staff ? (
                <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                  <DetailRow
                    label="Employment ID"
                    value={staff.employmentId}
                  />
                  <DetailRow
                    label="Department"
                    value={staff.department}
                  />
                  <DetailRow
                    label="Designation"
                    value={staff.designation}
                  />
                  <DetailRow
                    label="Phone"
                    value={staff.phoneNumber}
                  />
                  <DetailRow
                    label="Status"
                    value={staff.isActive ? "Active" : "Inactive"}
                  />
                  <div className="md:col-span-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/admin/staff/${user.id}`}>
                        Open staff profile →
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {authored.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Authored announcements
              </CardTitle>
              <CardDescription className="text-xs">
                {authored.length} post{authored.length === 1 ? "" : "s"}{" "}
                across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-3">
                {authored.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-col gap-0.5 rounded-md border bg-card px-3 py-2.5"
                  >
                    <span className="font-medium">{a.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateLong(a.publishedAt)}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        <Separator />
        <div className="text-xs text-muted-foreground">
          <ShieldCheck className="mr-1 inline-block size-3" />
          All administrator actions on this user are logged to the audit
          trail.
        </div>
      </div>
    );
  });
};

export default page;
