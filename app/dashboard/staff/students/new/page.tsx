import { StudentForm } from "@/components/StudentForm/StudentForm";

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Students
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Add student
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Fill in the account details and profile. A roll number is generated
          automatically on submit and a StudentProfile is created against the
          matching user. Everything below is mocked — no live DB write.
        </p>
      </header>

      <StudentForm />
    </div>
  );
};

export default page;
