import { notFound } from "next/navigation";

import { EditTeacherForm } from "@/components/EditTeacherForm/EditTeacherForm";
import { findTeacher, findUser } from "@/lib/staff/staff-data";

type Params = Promise<{ teacherId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { teacherId } = await params;
  const teacher = findTeacher(teacherId);
  const user = findUser(teacherId);
  if (!teacher || !user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Edit · {user.name}
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Edit teacher
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Subject specialization updates here propagate to the course assignment
          screens and to the public profile.
        </p>
      </header>

      <EditTeacherForm
        teacherId={teacherId}
        defaults={{
          name: user.name,
          nic: teacher.nic,
          phoneNumber: teacher.phoneNumber,
          qualification: "", // stored elsewhere in real DB
          subjectSpecialization: teacher.subjectProficiency.join(", "),
          bio: teacher.bio,
          address: teacher.address,
          isActive: teacher.isActive,
        }}
      />
    </div>
  );
};

export default page;
