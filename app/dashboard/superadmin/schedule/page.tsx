// Server Component — superadmin Schedule console.
// Schedule entries are not yet modelled in prisma/schema.prisma; this
// page resolves the route with an honest schema-pending alert.

import Link from "next/link";
import { Calendar, Plus } from "lucide-react";

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
      title="Schedule"
      description="The weekly timetable: one slot per (course, day, time, room, teacher) tuple. The staff schedule page already renders this from in-memory demo data; once the schema lands, this view will mirror it from Prisma."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Schedule" },
      ]}
      actions={
        <Button size="sm" asChild>
          <Link href="/dashboard/superadmin/schedule/new">
            <Plus className="mr-1.5 size-3.5" />
            New slot
          </Link>
        </Button>
      }
    >
      <SuperadminStatStrip
        stats={[
          { label: "Slots", value: "—" },
          { label: "Courses", value: "—", hint: "In weekly calendar" },
          { label: "Teachers", value: "—", hint: "Distinct instructors" },
          { label: "Rooms", value: "—", hint: "Distinct rooms" },
        ]}
      />

      <Alert>
        <Calendar className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          The <code className="font-mono">ScheduleEntry</code> model is
          referenced by attendance marking. Until the migration ships, this
          page shows the planned shape — the staff schedule already uses an
          in-memory data layer for demo data.
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
              Fields the row UI will render once the migration is applied.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            schema preview
          </Badge>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {[
              ["courseId", "FK → Course.id"],
              ["teacherId", "FK → User.id (teacher)"],
              ["day", "mon · tue · wed · thu · fri · sat · sun"],
              ["startTime / endTime", "ISO HH:mm"],
              ["room", "Physical room identifier"],
              ["type", "lecture · lab · seminar"],
              ["status", "active · cancelled · rescheduled"],
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
