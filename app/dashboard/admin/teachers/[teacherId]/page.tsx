import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Mail, Phone, Pencil } from "lucide-react";

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

import {
  findCourse,
  findTeacher,
  findUser,
} from "@/lib/admin/admin-data";
import { formatDateLong, initials } from "@/lib/admin/formatters";

const Detail = ({
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

const page = ({
  params,
}: {
  params: Promise<{ teacherId: string }>;
}) => {
  return params.then(({ teacherId }) => {
    const teacher = findTeacher(teacherId);
    const user = findUser(teacherId);
    if (!teacher || !user) notFound();
    const courses = teacher.assignedCourseIds
      .map((id) => findCourse(id))
      .filter((c): c is NonNullable<typeof c> => c !== null);

    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/admin/teachers">
              <ArrowLeft className="size-3.5" />
              Back to teachers
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href={`/dashboard/admin/users/${user.id}/edit`}>
              <Pencil className="size-3.5" />
              Edit profile
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="size-20 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary text-xl text-primary-foreground">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                    {user.name}
                  </h1>
                  <Badge variant="outline">Teacher</Badge>
                  <Badge variant={teacher.isActive ? "secondary" : "destructive"}>
                    {teacher.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Briefcase className="size-3" /> {teacher.employmentId}
                  <span aria-hidden="true">·</span>
                  <Mail className="size-3" /> {user.email}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Biographical and assignment details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
              <div>
                <Detail label="Employment ID" value={teacher.employmentId} />
                <Detail label="NIC" value={teacher.nic} />
                <Detail label="Assigned class" value={teacher.assignedClass ?? "—"} />
                <Detail label="Section" value={teacher.section ?? "—"} />
                <Detail label="Hired" value={formatDateLong(teacher.hireDate)} />
              </div>
              <div>
                <Detail label="Phone" value={teacher.phoneNumber} />
                <Detail
                  label="Date of birth"
                  value={formatDateLong(teacher.dob)}
                />
                <Detail label="Address" value={teacher.address} />
                <Detail label="Email" value={user.email} />
              </div>
              <div className="md:col-span-2">
                <Detail
                  label="Subjects"
                  value={teacher.subjectProficiency.join(", ")}
                />
              </div>
              <div className="rounded-md border bg-card p-3 md:col-span-2">
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Bio
                </span>
                <p className="mt-1 text-sm">{teacher.bio}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Quick contacts
              </CardTitle>
              <CardDescription className="text-xs">
                Verified phone and email.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="size-3" />
                  Phone
                </span>
                <span className="font-mono text-xs">
                  {teacher.phoneNumber}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3" />
                  Email
                </span>
                <span className="font-mono text-xs">{user.email}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Last seen {formatDateLong(user.lastSeenAt)}.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-medium">
              Courses assigned
            </CardTitle>
            <CardDescription className="text-xs">
              {courses.length} total. Click any course to open its admin
              detail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {courses.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-2 rounded-md border bg-card px-3 py-2.5 md:flex-row md:items-center md:gap-4"
                >
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                      {c.code}
                    </span>
                    <Link
                      href={`/dashboard/admin/courses/${c.id}`}
                      className="font-medium hover:underline"
                    >
                      {c.title}
                    </Link>
                  </div>
                  <Badge variant="outline">{c.status.toUpperCase()}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {c.enrolled} / {c.capacity} enrolled
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  });
};

export default page;
