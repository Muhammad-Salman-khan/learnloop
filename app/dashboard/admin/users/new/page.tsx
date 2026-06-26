import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CreateUserForm } from "@/components/CreateUserForm/CreateUserForm";

const page = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Users · Create
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Create a new user
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Add any role to LearnHub manually. The user will receive a magic
          link email if you leave &ldquo;Send welcome email&rdquo; enabled.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Account details
          </CardTitle>
          <CardDescription className="text-xs">
            All fields marked optional can be filled in later from the user&apos;s
            profile page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
