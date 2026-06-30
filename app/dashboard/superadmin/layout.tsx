import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SuperadminShell } from "@/components/SuperadminShell/SuperadminShell";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  if (session.user.role !== "superAdmin") redirect("/dashboard");

  const impersonatedBy =
    (session as unknown as { impersonatedBy?: string | null }).impersonatedBy ??
    null;

  return (
    <SuperadminShell
      impersonatingTargetName={impersonatedBy ? session.user.name : undefined}
    >
      {children}
    </SuperadminShell>
  );
};

export default layout;
