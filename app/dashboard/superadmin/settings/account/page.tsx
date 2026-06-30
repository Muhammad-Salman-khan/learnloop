// Server Component — Settings · Account at /dashboard/superadmin/settings/account
// Pulls the live signed-in super-admin via auth.api.getSession() and renders
// profile (read-only) plus interactive profile-update + change-password
// forms. The interactive forms live in dedicated Client components so this
// stays a pure Server Component.

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SuperadminPage,
} from "@/components/SuperadminPage/SuperadminPage";
import { SuperadminAccountProfileForm } from "@/components/SuperadminAccountProfileForm/SuperadminAccountProfileForm";
import { SuperadminAccountPasswordForm } from "@/components/SuperadminAccountPasswordForm/SuperadminAccountPasswordForm";
import {
  roleBadgeVariant,
  roleLabel,
  type SuperadminRole,
} from "@/lib/superadmin/roles";

const page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  // The parent layout already redirects non-superAdmins, but we guard here
  // too so this page is safe to render in isolation (e.g. worktree / story).
  if (!user) {
    return null;
  }

  const role = user.role as SuperadminRole;
  const impersonatedBy =
    (session as unknown as { impersonatedBy?: string | null })
      .impersonatedBy ?? null;

  const sessionObj = session as unknown as { session?: { createdAt?: string } };
  const signedInAt = sessionObj.session?.createdAt ?? null;

  return (
    <SuperadminPage
      eyebrow="Configuration · Account"
      title="Your account"
      description="The single super-admin profile. Email is the sign-in identifier; name and avatar are public on the platform. Password changes are immediate and invalidate no other sessions."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Settings", href: "/dashboard/superadmin/settings" },
        { label: "Account" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Profile
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              {user.name}
            </CardTitle>
            <CardDescription className="text-xs">
              {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Role
              </span>
              <Badge variant={roleBadgeVariant(role)}>{roleLabel(role)}</Badge>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Email verified
              </span>
              {user.emailVerified ? (
                <Badge variant="secondary">Verified</Badge>
              ) : (
                <Badge variant="outline" className="font-mono">
                  pending
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Signed in
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {signedInAt
                  ? new Date(signedInAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>
            {impersonatedBy ? (
              <div className="flex items-center justify-between gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-amber-700 dark:text-amber-300">
                <span className="text-[10.5px] uppercase tracking-[0.18em]">
                  Impersonating
                </span>
                <Badge variant="outline" className="font-mono">
                  active
                </Badge>
              </div>
            ) : null}
            <code className="break-all rounded-md border bg-muted/30 px-3 py-2 text-[10.5px] text-muted-foreground">
              id: {user.id}
            </code>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Update profile
              </CardTitle>
              <CardDescription className="text-xs">
                Change how your name appears across the platform. Avatar is
                deferred — drop a user image into the{" "}
                <code className="font-mono">User.image</code> column once the
                file uploader ships.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SuperadminAccountProfileForm
                defaultName={user.name}
                defaultEmail={user.email}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Change password
              </CardTitle>
              <CardDescription className="text-xs">
                Confirms via better-auth. Other sessions stay live until they
                expire.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SuperadminAccountPasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperadminPage>
  );
};

export default page;
