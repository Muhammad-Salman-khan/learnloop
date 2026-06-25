import { Badge } from "@/components/ui/badge";
import { TeacherCoursesGrid } from "@/components/TeacherCoursesGrid/TeacherCoursesGrid";
import { teacherCourses } from "@/lib/dashboard/teacher-data";

const page = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <section>
        <Badge variant="secondary" className="mb-3 font-mono uppercase tracking-[0.14em]">
          Workspace, demo data
        </Badge>
        <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl lg:text-[2.75rem]">
          My courses
        </h1>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground md:text-base">
          {teacherCourses.length} courses on your plate this term. Open one to
          manage its roadmap, materials, students, and assignments.
        </p>
      </section>

      <TeacherCoursesGrid courses={teacherCourses} />
    </div>
  );
};

export default page;
