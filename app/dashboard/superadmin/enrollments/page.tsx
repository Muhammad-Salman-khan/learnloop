// Server Component — superadmin Enrollments console.
// Enrollment is not yet modelled in prisma/schema.prisma; this page
// resolves the route with an honest schema-pending alert.

import Link from "next/link";
import { UserPlus, Plus } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      eyebrow="Super-admin · Academics"
      title="Enrollments"
      description="Every row that joins a Student to a Course in a Batch. Powers attendance book, marks entry, and fee generation."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Courses", href: "/dashboard/superadmin/courses" },
        { label: "Enrollments" },
      ]}
      actions={
        <Button size="sm" asChild>
          <Link href="/dashboard/superadmin/enrollments/new">
            <Plus className="mr-1.5 size-3.5" />
            New enrollment
          </Link>
        </Button>
      }
    >
      <SuperadminStatStrip
        stats={[
          { label: "Enrollments", value: "—" },
          { label: "Active", value: "—", hint: "Currently in session" },
          { label: "Pending", value: "—", hint: "Awaiting approval" },
          { label: "Dropped", value: "—", hint: "Withdrawn this term" },
        ]}
      />

      <Alert>
        <UserPlus className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          An <code className="font-mono">Enrollment</code> table is the join
          between <code className="font-mono">User</code> (student),{" "}
          <code className="font-mono">Course</code>, and{" "}
          <code className="font-mono">Batch</code>. Until the migration ships,
          this page shows the planned shape only.
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
              One row per (student, course, batch) tuple.
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
              ["courseId", "FK → Course.id"],
              ["batchId", "FK → Batch.id"],
              ["enrollmentDate", "When the row was created"],
              ["status", "active · completed · dropped · pending"],
              ["grade", "Final grade on completion"],
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
    </SuperadminPage>
  );
};

export default page;
