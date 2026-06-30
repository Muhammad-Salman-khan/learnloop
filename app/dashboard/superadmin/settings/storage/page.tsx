// Server Component — Settings · Storage at /dashboard/superadmin/settings/storage
// Storage configuration page (Cloudinary etc.). .env-only today.

import { Database, Save } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SuperadminPage } from "@/components/SuperadminPage/SuperadminPage";

const STORAGE_PREVIEW = [
  ["storage.driver", "cloudinary"],
  ["storage.cloudName", "(set in .env)"],
  ["storage.apiKey", "secret"],
  ["storage.apiSecret", "secret"],
  ["storage.uploadFolder", "learnhub"],
  ["storage.allowedMime[]", "image/* · application/pdf"],
  ["storage.maxBytes", "10 MB"],
  ["storage.urlTtl", "3600s"],
] as const;

const page = () => {
  return (
    <SuperadminPage
      eyebrow="Configuration · Storage"
      title="File storage"
      description="Choose where uploaded media (avatars, course materials, certificates) lives. Cloudinary is wired today; S3 and local-disk drivers are on the roadmap."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Settings", href: "/dashboard/superadmin/settings" },
        { label: "Storage" },
      ]}
      actions={
        <Button size="sm">
          <Save className="mr-1.5 size-3.5" />
          Save (coming soon)
        </Button>
      }
    >
      <Alert>
        <Database className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          Storage is bound to <code className="font-mono">.env</code>{" "}
          (<code className="font-mono">CLOUDINARY_*</code>). Once a Settings
          singleton lands, edits will be persisted here.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Drivers
          </CardTitle>
          <CardDescription className="text-xs">
            Pick a driver. Only Cloudinary is active today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <DriverCard label="Cloudinary" status="active" />
            <DriverCard label="S3" status="planned" />
            <DriverCard label="Local disk" status="planned" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Active settings
          </CardTitle>
          <CardDescription className="text-xs">
            Keys consumed by the storage adapter.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="pr-5 text-right">Origin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STORAGE_PREVIEW.map(([k, v]) => (
                <TableRow key={k}>
                  <TableCell className="pl-5 font-mono text-xs">{k}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {v}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Badge variant="outline" className="font-mono">
                      env
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SuperadminPage>
  );
};

export default page;

function DriverCard({
  label,
  status,
}: {
  readonly label: string;
  readonly status: "active" | "planned";
}) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-xs">
      <span className="font-medium">{label}</span>
      <Badge
        variant={status === "active" ? "default" : "outline"}
        className="font-mono"
      >
        {status}
      </Badge>
    </div>
  );
}
