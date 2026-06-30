// Server Component — superadmin Announcements oversight.
// The Announcement table is not yet in prisma/schema.prisma; this page
// resolves the route with an honest empty placeholder.

import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";

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
      eyebrow="Super-admin · Communication"
      title="Announcements"
      description="Platform-wide notices authored by admins / staff and surfaced into every dashboard. The Staff surface already creates demo announcements; this is the super-admin oversight."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Announcements" },
      ]}
      actions={
        <Button size="sm" asChild>
          <Link href="/dashboard/admin/announcements/new">
            <Plus className="mr-1.5 size-3.5" />
            New announcement
          </Link>
        </Button>
      }
    >
      <SuperadminStatStrip
        stats={[
          { label: "Announcements", value: "—" },
          { label: "Active", value: "—", hint: "Currently visible" },
          { label: "Drafts", value: "—", hint: "Not yet published" },
          { label: "Archived", value: "—", hint: "Past term" },
        ]}
      />

      <Alert>
        <Megaphone className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          The <code className="font-mono">Announcement</code> table is not yet
          in schema.prisma. Demo data lives on{" "}
          <code className="font-mono">
            lib/admin/admin-data → AdminAnnouncement[]
          </code>{" "}
          and the staff/admin surfaces consume it. Once migrated, this view
          renders the platform-wide feed.
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
              ["title", "Headline"],
              ["content", "Markdown body"],
              ["authorId", "FK → User.id"],
              ["targetAudience[]", "Roles / cohorts that can see this"],
              ["priority", "low · medium · high · urgent"],
              ["startDate / endDate", "Visibility window"],
              ["status", "active · draft · archived"],
              ["views", "Read counter (analytics)"],
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
          href="/dashboard/admin/announcements"
          className="text-muted-foreground hover:underline"
        >
          Author from Staff/Admin → Announcements (demo data) →
        </Link>
      </div>
    </SuperadminPage>
  );
};

export default page;
