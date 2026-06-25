import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewCourseForm } from "@/components/NewCourseForm/NewCourseForm";

const page = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <section>
        <Badge variant="secondary" className="mb-3 font-mono uppercase tracking-[0.14em]">
          New course
        </Badge>
        <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">
          Start a new course
        </h1>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground md:text-base">
          Set up the basics today  -  students, materials, and assignments come
          after. You can keep this as a draft until you&apos;re ready to enrol.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium tracking-tight">
            Course setup
          </CardTitle>
          <CardDescription>
            All fields are required. You can rename or move sections later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewCourseForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
