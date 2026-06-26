import { notFound } from "next/navigation";

import { findUser } from "@/lib/admin/admin-data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditUserForm } from "@/components/EditUserForm/EditUserForm";

const page = ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  return params.then(({ userId }) => {
    const user = findUser(userId);
    if (!user) notFound();
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Users · Edit
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Edit {user.name}
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            Update identity, role, and access. Ban changes take effect on
            next sign-in.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-medium">
              Edit profile
            </CardTitle>
            <CardDescription className="text-xs">
              Required fields are validated inline as you type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditUserForm user={user} />
          </CardContent>
        </Card>
      </div>
    );
  });
};

export default page;
