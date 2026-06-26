import { findUser } from "@/lib/admin/admin-data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminAccountForm } from "@/components/AdminAccountForm/AdminAccountForm";

const page = () => {
  const admin = findUser("usr_01");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Admin · Account
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Account settings
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Update your name, email, phone, and timezone. Changes take effect
          immediately.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Profile
          </CardTitle>
          <CardDescription className="text-xs">
            Required fields are validated inline as you type.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admin ? (
            <AdminAccountForm
              name={admin.name}
              email={admin.email}
              phone=""
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Admin user not found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
