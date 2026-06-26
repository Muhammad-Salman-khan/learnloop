import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Wallet } from "lucide-react";

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
import { Progress } from "@/components/ui/progress";

import {
  findCourse,
  findStudent,
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

function feeVariant(
  status: "paid" | "due" | "unpaid",
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "paid") return "secondary";
  if (status === "due") return "outline";
  return "destructive";
}

const page = ({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) => {
  return params.then(({ studentId }) => {
    const student = findStudent(studentId);
    const user = findUser(studentId);
    if (!student || !user) notFound();

    const courses = student.enrolledCourseIds
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
            <Link href="/dashboard/admin/students">
              <ArrowLeft className="size-3.5" />
              Back to students
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/dashboard/admin/users/${user.id}/edit`}
                className="gap-1.5"
              >
                <Pencil className="size-3.5" />
                Edit
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link
                href={`/dashboard/admin/students/${student.userId}/fees`}
                className="gap-1.5"
              >
                <Wallet className="size-3.5" />
                Manage fees
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
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
                  <Badge variant="outline">Student</Badge>
                  <Badge variant={feeVariant(student.feeStatus)}>
                    Fee · {student.feeStatus.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  Roll: {student.rollNumber} · Class {student.className}{" "}
                  · Section {student.section}
                </span>
                <span className="text-xs text-muted-foreground">
                  Enrolled {formatDateLong(student.enrollmentDate)} ·{" "}
                  {courses.length} courses
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
                Family, contact, and admission details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
              <div>
                <Detail label="Student ID" value={student.userId} />
                <Detail label="Roll number" value={student.rollNumber} />
                <Detail label="Father's name" value={student.fatherName} />
                <Detail label="Mother's name" value={student.motherName} />
                <Detail
                  label="Date of birth"
                  value={formatDateLong(student.dob)}
                />
              </div>
              <div>
                <Detail label="Phone" value={student.phoneNumber} />
                <Detail label="Parent phone" value={student.parentPhone} />
                <Detail label="Email" value={user.email} />
                <Detail label="Address" value={student.address} />
                <Detail
                  label="Last sign-in"
                  value={formatDateLong(user.lastSeenAt)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Fee state
              </CardTitle>
              <CardDescription className="text-xs">
                Current cycle snapshot.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2.5">
                <span className="text-xs text-muted-foreground">
                  Current month
                </span>
                <Badge variant={feeVariant(student.feeStatus)}>
                  {student.feeStatus.toUpperCase()}
                </Badge>
              </div>
              {student.feeStatus === "paid" ? (
                <p className="text-xs text-muted-foreground">
                  No balance outstanding for the current cycle.
                </p>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/dashboard/admin/students/${student.userId}/fees`}
                  >
                    Resolve balance →
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-medium">
              Enrolled courses
            </CardTitle>
            <CardDescription className="text-xs">
              {courses.length} total. Progress is mocked for the demo data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {courses.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 rounded-md border bg-card px-3 py-2.5"
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
                  <Progress
                    value={Math.min(100, c.enrolled)}
                    className="hidden md:block md:w-32"
                  />
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
