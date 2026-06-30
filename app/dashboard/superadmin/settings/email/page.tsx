// Server Component — Settings · Email at /dashboard/superadmin/settings/email
// Email / SMTP configuration. Bound to env today.

import { Megaphone, Save } from "lucide-react";

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

const EMAIL_PREVIEW = [
  ["email.provider", "smtp"],
  ["email.from", "LearnHub <no-reply@learnhub.local>"],
  ["email.fromName", "LearnHub"],
  ["email.replyTo", "support@learnhub.local"],
  ["email.smtp.host", "smtp.resend.com"],
  ["email.smtp.port", "587"],
  ["email.smtp.user", "secret"],
  ["email.smtp.password", "secret"],
  ["email.templates.invite", "(markdown)"],
  ["email.templates.passwordReset", "(markdown)"],
  ["email.templates.announcement", "(markdown)"],
] as const;

const page = () => {
  return (
    <SuperadminPage
      eyebrow="Configuration · Email"
      title="Email"
      description="From-address, SMTP, and the markdown templates used by invites, password resets, and announcement broadcasts."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Settings", href: "/dashboard/superadmin/settings" },
        { label: "Email" },
      ]}
      actions={
        <Button size="sm">
          <Save className="mr-1.5 size-3.5" />
          Save (coming soon)
        </Button>
      }
    >
      <Alert>
        <Megaphone className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          Email is bound to <code className="font-mono">.env</code>{" "}
          (<code className="font-mono">EMAIL_*</code>). Marketing-campaign
          templates come once the Settings singleton row ships.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Active settings
          </CardTitle>
          <CardDescription className="text-xs">
            Keys consumed by the email adapter.
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
              {EMAIL_PREVIEW.map(([k, v]) => (
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
