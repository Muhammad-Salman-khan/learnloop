// Server Component — Settings · Institute at /dashboard/superadmin/settings/institute
// The Institute table is not yet in prisma/schema.prisma. This page renders
// the planned read/write fields and shows where future Server Actions will
// dispatch.

import Link from "next/link";
import { Building2, Save } from "lucide-react";

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
import { SuperadminPage } from "@/components/SuperadminPage/SuperadminPage";

const page = () => {
  return (
    <SuperadminPage
      eyebrow="Configuration · Institute"
      title="Institute profile"
      description="Platform-level identity: name, registration code, address, branding, and academic calendar. Stored on a singleton Institute row once the migration ships."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Settings", href: "/dashboard/superadmin/settings" },
        { label: "Institute" },
      ]}
      actions={
        <Button size="sm">
          <Save className="mr-1.5 size-3.5" />
          Save (coming soon)
        </Button>
      }
    >
      <Alert>
        <Building2 className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          No <code className="font-mono">Institute</code> singleton in schema yet.
          Fields below describe the surface area and will become live edit
          inputs the moment the migration ships.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Identity
          </CardTitle>
          <CardDescription className="text-xs">
            Shown on every certificate, login screen, and e-mail footer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {[
              ["name", "Display name (e.g. LearnHub Academy)"],
              ["registrationCode", "Government / board registration number"],
              ["foundedYear", "Year of establishment"],
              ["contactEmail / contactPhone", "Public contact"],
              ["addressLines[]", "Postal address"],
              ["logoUrl", "Square logo, ≥ 512px"],
              ["tagline", "Single-line tagline for hero blocks"],
              ["locale", "Default UI locale"],
              ["timezone", "Default scheduling TZ"],
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

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="font-display text-lg font-medium">
              Academic calendar
            </CardTitle>
            <CardDescription className="text-xs">
              Drives term boundaries on batch management.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            schema preview
          </Badge>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {[
              ["termSystem", "annual · semester · trimester"],
              ["currentTermId", "FK → Batch.id (active)"],
              ["defaultCalendar", "gregorian · hijri · custom"],
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
          href="/dashboard/superadmin/settings"
          className="text-xs text-muted-foreground hover:underline"
        >
          ← All settings
        </Link>
      </div>
    </SuperadminPage>
  );
};

export default page;
