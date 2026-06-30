// Server Component — superadmin Attendance oversight.
// The Attendance table is not yet in prisma/schema.prisma; this page
// resolves the route with an honest empty placeholder.

import Link from "next/link";
import { Calendar } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  SuperadminStatStrip,
} from "@/components/SuperadminPage/SuperadminPage";

const page = () => {
  return (
    <SuperadminPage
      eyebrow="Super-admin · Reporting"
      title="Attendance"
      description="Cross-platform attendance overview. Drill from a course down to a single student's daily attendance. Staff and teachers mark attendance; the super-admin view is read-only oversight."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Attendance" },
      ]}
    >
      <SuperadminStatStrip
        stats={[
          { label: "Today present", value: "—" },
          { label: "Today absent", value: "—" },
          { label: "Today late", value: "—" },
          { label: "Avg rate (term)", value: "—", hint: "Across active courses" },
        ]}
      />

      <Alert>
        <Calendar className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          An <code className="font-mono">Attendance</code> table is referenced
          by the teacher-per-day marking flow. Until the migration ships, this
          page shows the planned shape.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Schema preview
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              Planned columns
            </CardTitle>
            <CardDescription className="text-xs">
              One row per (student, schedule slot, date).
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            schema preview
          </Badge>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {[
              ["studentId", "FK → User.id"],
              ["courseId", "FK → Course.id (or scheduleEntryId)"],
              ["date", "Calendar date"],
              ["status", "present · absent · late · excused"],
              ["notes", "Free-text justification"],
              ["markedBy", "FK → User.id (teacher / staff)"],
              ["createdAt", "Row timestamp"],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-start gap-2 rounded-md border bg-muted/30 px-3 py-2"
              >
                <code className="shrink-0 font-mono text-[11px]">{k}</code>
                <span className="text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <Link
          href="/dashboard/staff/fees"
          className="text-muted-foreground hover:underline"
        >
          Use the staff tools for in-class marking until this lands →
        </Link>
      </div>
    </SuperadminPage>
  );
};

export default page;
