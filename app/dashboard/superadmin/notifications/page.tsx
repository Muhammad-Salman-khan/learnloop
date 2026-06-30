// Server Component — superadmin Notifications oversight.
// The Notification table is not yet in prisma/schema.prisma; this page
// resolves the route with an honest empty placeholder.

import Link from "next/link";
import { AlertTriangle, Megaphone } from "lucide-react";

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
      eyebrow="Super-admin · Communication"
      title="Notifications"
      description="Platform-wide alert console: ad-hoc pushes and cron-backed digests. The Staff surface already authors demo notifications; this view mirrors them from Prisma post-migration."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Notifications" },
      ]}
    >
      <SuperadminStatStrip
        stats={[
          { label: "Notifications", value: "—" },
          { label: "Sent (24h)", value: "—" },
          { label: "Scheduled", value: "—" },
          { label: "Drafts", value: "—" },
        ]}
      />

      <Alert>
        <AlertTriangle className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          The <code className="font-mono">Notification</code> table is not yet
          in schema.prisma. Until shipped, this page renders the planned shape
          and forwards to the Staff → Notifications surface for live authoring.
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
              ["message", "Body"],
              ["type", "info · success · warning · error"],
              ["targetRole[]", "Roles to broadcast to"],
              ["sentAt", "Dispatch timestamp"],
              ["readCount", "How many targets read it"],
              ["totalTargets", "How many targets exist"],
              ["status", "sent · scheduled · draft"],
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
          href="/dashboard/staff/notifications"
          className="text-muted-foreground hover:underline"
        >
          Use Staff → Notifications for the demo inbox →
        </Link>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Megaphone className="size-3" /> Ad-hoc via{" "}
          <code className="font-mono">/dashboard/staff/notifications/new</code>
        </span>
      </div>
    </SuperadminPage>
  );
};

export default page;
