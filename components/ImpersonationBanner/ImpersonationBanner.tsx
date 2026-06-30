"use client";

import { stopImpersonation } from "@/app/actions/superadmin";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImpersonationBanner({
  impersonating,
  targetName,
}: {
  readonly impersonating: boolean;
  readonly targetName?: string;
}) {
  if (!impersonating) return null;
  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-amber-500/40 bg-amber-100 px-4 py-2 text-amber-900 md:px-6 dark:bg-amber-950 dark:text-amber-100">
      <Eye className="size-3.5 shrink-0" />
      <span className="text-xs font-medium">
        Viewing as {targetName ?? "another user"}. Actions you take are recorded
        against your super-admin account.
      </span>
      <form
        action={async () => {
          await stopImpersonation();
        }}
        className="ml-auto"
      >
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 border-amber-500/50 bg-transparent text-amber-900 hover:bg-amber-200 dark:text-amber-100 dark:hover:bg-amber-900"
        >
          <X className="size-3" />
          Exit view
        </Button>
      </form>
    </div>
  );
}

export default ImpersonationBanner;
