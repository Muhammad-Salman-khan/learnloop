// Server Component — edit a single super-admin user at the canonical path
// /dashboard/superadmin/users/[userId]/edit.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SuperadminPage } from "@/components/SuperadminPage/SuperadminPage";
import { SuperadminUserEditForm } from "@/components/SuperadminUserEditForm/SuperadminUserEditForm";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { findUserById } from "@/lib/superadmin/data";
import {
  ALL_ROLES,
  roleLabel,
  type SuperadminRole,
} from "@/lib/superadmin/roles";

const page = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const meId = session?.user?.id ?? null;

  const user = await findUserById(userId);
  if (!user) notFound();

  const role = user.role as SuperadminRole;
  const isValidRole = ALL_ROLES.includes(role);
  const isSelf = meId === user.id;

  return (
    <SuperadminPage
      eyebrow="Super-admin · User · Edit"
      title={`Edit ${user.name}`}
      description="Update display name, login email, and assigned role. Email change re-issues verification."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Users", href: "/dashboard/superadmin/users" },
        { label: user.name, href: `/dashboard/superadmin/users/${user.id}` },
        { label: "Edit" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Profile
          </CardTitle>
          <CardDescription className="text-xs">
            Current role:{" "}
            <span className="font-mono">
              {isValidRole ? roleLabel(role) : user.role}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SuperadminUserEditForm
            userId={user.id}
            defaultName={user.name}
            defaultEmail={user.email}
            defaultRole={
              isValidRole
                ? role
                : ("student" as SuperadminRole)
            }
            isSelf={isSelf}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/superadmin/users/${user.id}`}>
            <ChevronLeft className="mr-1.5 size-3.5" />
            Back to profile
          </Link>
        </Button>
      </div>
    </SuperadminPage>
  );
};

export default page;
