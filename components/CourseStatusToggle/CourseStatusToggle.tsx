"use client";

import { Archive, ArchiveRestore, Play, Pause } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { CourseStatus } from "@/lib/admin/admin-data";

type CourseStatusToggleProps = {
  readonly courseId: string;
  readonly code: string;
  readonly status: CourseStatus;
};

// Demo action: toggles live ↔ draft and offers archive/restore. We don't
// rebuild the rendered card on this action — instead it just toasts and
// relaunches a server refresh on click, which is fine while the database
// round-trip is mocked.
export function CourseStatusToggle({
  courseId,
  code,
  status,
}: CourseStatusToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => {
          const next: CourseStatus =
            status === "live" ? "draft" : "live";
          toast.success(`${code} now ${next}`, {
            description: `Course ${courseId} status changed (demo).`,
          });
        }}
      >
        {status === "live" ? (
          <>
            <Pause className="size-3.5" />
            Unpublish
          </>
        ) : (
          <>
            <Play className="size-3.5" />
            Publish
          </>
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5"
        onClick={() => {
          toast.success(
            `${code} ${status === "archived" ? "restored" : "archived"}`,
          );
        }}
      >
        {status === "archived" ? (
          <>
            <ArchiveRestore className="size-3.5" />
            Restore
          </>
        ) : (
          <>
            <Archive className="size-3.5" />
            Archive
          </>
        )}
      </Button>
    </div>
  );
}

export default CourseStatusToggle;
