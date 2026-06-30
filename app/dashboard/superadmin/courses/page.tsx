// Server Component — superadmin Courses console.
// The Course model is not yet present in prisma/schema.prisma; the page
// renders an honest empty-schema placeholder so the route resolves and
// flags the missing model. When the migration lands, swap the helper
// stub for a real Prisma query.

import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

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
      title="Courses"
      description="Top-level course catalog. Each course has a code, title, instructor, schedule, and capacity. Course records feed /dashboard/superadmin/batches, /enrollments, /schedule, and /fees."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Courses" },
      ]}
      actions={
        <Button size="sm" asChild>
          <Link href="/dashboard/superadmin/courses/new">
            <Plus className="mr-1.5 size-3.5" />
            New course
          </Link>
        </Button>
      }
    >
      <SuperadminStatStrip
        stats={[
          { label: "Courses", value: "—" },
          { label: "Active", value: "—", hint: "Status: active" },
          { label: "Drafts", value: "—", hint: "Status: draft" },
          { label: "Archived", value: "—", hint: "Retired this term" },
        ]}
      />

      <Alert>
        <BookOpen className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          A <code className="font-mono">Course</code> table is referenced by
          batches, enrollments, schedule, fees, attendance, and results. Until
          the migration is shipped, this page renders the planned layout below.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Catalog
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              Planned columns
            </CardTitle>
            <CardDescription className="text-xs">
              These are the fields that the page will render once the schema lands.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            schema preview
          </Badge>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {[
              ["code", "Short identifier (e.g. CS-201)"],
              ["title", "Display name"],
              ["description", "Long form synopsis"],
              ["credits", "Weight in transcripts"],
              ["department", "Owning department"],
              ["instructorId", "FK → User.id (teacher)"],
              ["capacity", "Max enrollment"],
              ["schedule", "Default weekly slot"],
              ["status", "active · draft · archived"],
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
