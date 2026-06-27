import { TeacherForm } from "@/components/TeacherForm/TeacherForm";

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Teachers
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Add teacher
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Create a User with role=teacher and an associated TeacherProfile in a
          single submission. The employment ID is auto-assigned on save.
        </p>
      </header>

      <TeacherForm />
    </div>
  );
};

export default page;
