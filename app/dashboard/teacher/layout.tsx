import type { ReactNode } from "react";
import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { TeacherShell } from "@/components/TeacherShell/TeacherShell";
import { TeacherHeader } from "@/components/TeacherHeader/TeacherHeader";

// Server Component layout. The real auth gate lives at app/dashboard/layout.tsx;
// this one only needs to greet the teacher by name.
const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const firstName = session?.user?.name?.split(/\s+/)[0] ?? "Salman";

  return (
    <TeacherShell>
      <TeacherHeader firstName={firstName} />
      <main className="flex-1">{children}</main>
    </TeacherShell>
  );
};

export default layout;
