import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";
import { StaffCoursesTable } from "@/components/StaffCoursesTable/StaffCoursesTable";
import {
  adminCourses,
  findUser,
} from "@/lib/staff/staff-data";

const page = () => {
  const liveCount = adminCourses.filter((c) => c.status === "live").length;
  const draftCount = adminCourses.filter((c) => c.status === "draft").length;
  const archivedCount = adminCourses.filter(
    (c) => c.status === "archived",
  ).length;

  const rows = adminCourses.map((course) => ({
    course,
    teacher: findUser(course.teacherUserId),
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Courses
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Course catalogue
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Every course on LearnHub. Open a course to manage enrolled students,
          weekly slots, and results.
        </p>
      </header>

      <AdminStatStrip
        items={[
          { label: "Live courses", value: String(liveCount), hint: "In active rotation" },
          { label: "Draft courses", value: String(draftCount), hint: "Awaiting launch" },
          { label: "Archived courses", value: String(archivedCount), hint: "Kept for reference" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            All courses
          </CardTitle>
          <CardDescription className="text-xs">
            {adminCourses.length} courses · filtered & paginated below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffCoursesTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
