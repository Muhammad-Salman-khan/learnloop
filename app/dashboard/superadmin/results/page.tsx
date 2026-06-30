// Server Component — superadmin Results oversight.
// The Result table is not yet in prisma/schema.prisma; this page
// resolves the route with an honest empty placeholder.

import Link from "next/link";
import { Activity, Download } from "lucide-react";

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
      eyebrow="Super-admin · Reporting"
      title="Results"
      description="Cross-platform exam and quiz results snapshot. Staff enter marks; this view is the platform-wide read-only oversight. Drill from a course into the per-student breakdown once the schema lands."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Results" },
      ]}
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/staff/results/export">
            <Download className="mr-1.5 size-3.5" />
            Export demo data
          </Link>
        </Button>
      }
    >
      <SuperadminStatStrip
        stats={[
          { label: "Results", value: "—" },
          { label: "Published", value: "—", hint: "Visible to students" },
          { label: "Drafts", value: "—", hint: "Pending publication" },
          { label: "Withheld", value: "—", hint: "Held for moderation" },
        ]}
      />

      <Alert>
        <Activity className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          The <code className="font-mono">Result</code> (or{" "}
          <code className="font-mono">ResultRow</code>) table is not yet in
          schema.prisma. The Staff → Results surface already renders demo
          data; this view will mirror it from Prisma.
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
              One row per (student, course, examType).
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
              ["examType", "midterm · final · assignment · quiz"],
              ["marksObtained", "Numeric"],
              ["totalMarks", "Numeric"],
              ["percentage", "Derived (marksObtained / totalMarks)"],
              ["grade", "Letter / GPA"],
              ["remarks", "Free-text"],
              ["publishedAt", "Goes live date"],
              ["status", "published · draft · withheld"],
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

      <div className="flex justify-end">
        <Link
          href="/dashboard/staff/results"
          className="text-xs text-muted-foreground hover:underline"
        >
          Use the staff results surface for demo data →
        </Link>
      </div>
    </SuperadminPage>
  );
};

export default page;
