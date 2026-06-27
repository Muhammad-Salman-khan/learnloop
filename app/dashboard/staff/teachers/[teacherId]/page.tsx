import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Mail, Pencil, Phone } from "lucide-react";

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { StaffCoursesTable } from "@/components/StaffCoursesTable/StaffCoursesTable";
import { StaffCourseScheduleTable } from "@/components/StaffCourseScheduleTable/StaffCourseScheduleTable";
import {
  findCourse,
  findTeacher,
  findUser,
  scheduleEntries,
} from "@/lib/staff/staff-data";
import {
  formatDateLong,
  initials,
} from "@/lib/admin/formatters";

type Params = Promise<{ teacherId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { teacherId } = await params;
  const teacher = findTeacher(teacherId);
  const user = findUser(teacherId);
  if (!teacher || !user) {
    notFound();
  }

  const courses = teacher.assignedCourseIds
    .map((id) => findCourse(id))
    .filter((c) => c !== null);

  const upcomingSlots = scheduleEntries
    .filter((s) => s.teacherUserId === teacherId)
    .map((s) => ({ ...s, course: findCourse(s.courseId) }))
    .filter((s) => s.course !== null)
    .sort((a, b) => {
      const order = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      const da = order.indexOf(a.day) - order.indexOf(b.day);
      if (da !== 0) return da;
      return a.startTime.localeCompare(b.startTime);
    });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="size-16 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary text-base text-primary-foreground">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Teacher profile
            </span>
            <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              {user.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {user.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" />
                {teacher.phoneNumber}
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em]">
                {teacher.employmentId}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/staff/teachers/${teacherId}/edit`}>
              <Pencil className="mr-1.5 size-3.5" />
              Edit teacher
            </Link>
          </Button>
        </div>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[480px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="schedule">Teaching slots</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="font-display text-lg font-medium">
                  About
                </CardTitle>
                <CardDescription className="text-xs">
                  The bio and identifiers shown on profile pages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-x-6 gap-y-3 text-sm md:grid-cols-2">
                  <Detail label="Full name" value={user.name} />
                  <Detail
                    label="Employment ID"
                    value={teacher.employmentId}
                    mono
                  />
                  <Detail label="NIC" value={teacher.nic} mono />
                  <Detail
                    label="Date of birth"
                    value={formatDateLong(teacher.dob)}
                  />
                  <Detail
                    label="Subject proficiency"
                    value={teacher.subjectProficiency.join(", ")}
                  />
                  <Detail
                    label="Assigned class"
                    value={
                      teacher.assignedClass
                        ? `${teacher.assignedClass}${
                            teacher.section ? ` · Sec ${teacher.section}` : ""
                          }`
                        : "—"
                    }
                  />
                  <Detail label="Bio" value={teacher.bio} wide />
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Status
                </span>
                <CardTitle className="font-display text-lg font-medium">
                  {teacher.isActive ? "Active" : "Inactive"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hire date</span>
                  <span className="font-mono text-xs">
                    {formatDateLong(teacher.hireDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Courses</span>
                  <Badge variant="secondary" className="font-mono">
                    {courses.length}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/dashboard/staff/teachers/${teacherId}/edit`}>
                    Manage status
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Assigned courses
              </CardTitle>
              <CardDescription className="text-xs">
                Every course currently taught by {user.name}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StaffCoursesTable
                rows={courses
                  .filter((c): c is NonNullable<typeof c> => c !== null)
                  .map((course) => ({
                    course,
                    teacher: user,
                  }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Weekly teaching slots
              </CardTitle>
              <CardDescription className="text-xs">
                Every slot owned by {user.name}, sorted across the week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StaffCourseScheduleTable slots={upcomingSlots} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function Detail({
  label,
  value,
  mono,
  wide,
}: {
  label: string;
  value: string;
  mono?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <dt className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd
        className={
          mono
            ? "mt-0.5 font-mono text-xs"
            : "mt-0.5 text-sm leading-snug"
        }
      >
        {value}
      </dd>
    </div>
  );
}

export default page;
