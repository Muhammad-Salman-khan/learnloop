import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SuperadminCreateUserForm } from "@/components/SuperadminCreateUserForm/SuperadminCreateUserForm";

const page = () => {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Super-admin · Users · New
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Create a new account
        </h1>
        <p className="text-sm text-muted-foreground">
          Issues a signUpEmail call against better-auth, then promotes the user
          to the role you select and writes the matching profile row.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            New user details
          </CardTitle>
          <CardDescription className="text-xs">
            Email becomes their sign-in identifier. The temporary password is
            shown after creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SuperadminCreateUserForm />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/superadmin/users">Cancel</Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
