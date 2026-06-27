import { notFound } from "next/navigation";

import { EditStudentForm } from "@/components/EditStudentForm/EditStudentForm";
import { findStudent, findUser } from "@/lib/staff/staff-data";

type Params = Promise<{ studentId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { studentId } = await params;
  const student = findStudent(studentId);
  const user = findUser(studentId);
  if (!student || !user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Edit · {user.name}
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Edit student
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Update the profile fields. Email, login password, and the assigned
          roll number are managed by the admin console.
        </p>
      </header>

      <EditStudentForm
        studentId={studentId}
        defaults={{
          name: user.name,
          className: student.className,
          section: student.section,
          fatherName: student.fatherName,
          motherName: student.motherName,
          dob: student.dob,
          phoneNumber: student.phoneNumber,
          parentPhone: student.parentPhone,
          address: student.address,
        }}
      />
    </div>
  );
};

export default page;
