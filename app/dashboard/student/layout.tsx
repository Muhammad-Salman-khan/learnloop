import type { ReactNode } from "react";
import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { StudentShell } from "@/components/StudentShell/StudentShell";
import { StudentHeader } from "@/components/StudentHeader/StudentHeader";

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Fall back gracefully if the upstream auth check that landed us here
  // ever drifts out of sync with this nested layout. Real route guards sit
  // at app/dashboard/layout.tsx; this one only needs a name to greet.
  const firstName = session?.user?.name?.split(/\s+/)[0] ?? "Student";

  return (
    <StudentShell>
      <StudentHeader firstName={firstName} />
      <main className="flex-1">{children}</main>
    </StudentShell>
  );
};

export default layout;
