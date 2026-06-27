import { ManualEnrollmentForm } from "@/components/ManualEnrollmentForm/ManualEnrollmentForm";
import { adminCourses, adminStudents, adminUsers } from "@/lib/staff/staff-data";

type Search = Promise<{ [key: string]: string | string[] | undefined }>;

const page = async ({ searchParams }: { searchParams: Search }) => {
  const params = await searchParams;
  const raw = params.student;
  const preselectedStudentId = Array.isArray(raw) ? raw[0] : raw;

  const rows = adminStudents
    .map((student) => {
      const user = adminUsers.find((u) => u.id === student.userId);
      return user ? { student, user } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Enrollments
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Manual enrollment
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Add an existing student into an additional course. Use the optional
          notes field to record the reason (overrides / transfers / out-of-cycle
          promotions).
        </p>
      </header>

      <ManualEnrollmentForm
        students={rows}
        courses={adminCourses}
        preselectedStudentId={preselectedStudentId}
      />
    </div>
  );
};

export default page;
