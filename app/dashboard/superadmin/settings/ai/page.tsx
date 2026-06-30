// Server Component — Settings · AI at /dashboard/superadmin/settings/ai
// AI-provider configuration for analytics, suggestions, and personalization.
// Could not surface a live Settings table from Prisma; this page renders
// the planned shape with provider form controls.

import { Settings2, Save } from "lucide-react";

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

const SETTINGS_PREVIEW = [
  ["ai.defaultProvider", "openai"],
  ["ai.fallbackProvider", "anthropic"],
  ["ai.model.chat", "gpt-4o"],
  ["ai.model.embeddings", "text-embedding-3-large"],
  ["ai.model.tutor", "claude-3-7-sonnet"],
  ["ai.temperature", "0.2"],
  ["ai.maxTokens", "2048"],
  ["ai.systemPrompt", "(platform default)"],
  ["ai.dailyBudgetUsd", "25"],
  ["ai.enableForRoles", "staff · admin"],
] as const;

const page = () => {
  return (
    <SuperadminPage
      eyebrow="Configuration · AI"
      title="AI provider"
      description="Configure which model serves chat, embeddings, and the in-platform AI tutor. Budget and daily spend live here too. Stored on a singleton Settings row keyed by category."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Settings", href: "/dashboard/superadmin/settings" },
        { label: "AI" },
      ]}
      actions={
        <Button size="sm">
          <Save className="mr-1.5 size-3.5" />
          Save (coming soon)
        </Button>
      }
    >
      <Alert>
        <Settings2 className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          Settings live in <code className="font-mono">.env</code> today and
          a singleton Settings table is on the roadmap. The map below shows
          the keys that will be persisted.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Active settings
          </CardTitle>
          <CardDescription className="text-xs">
            Keys resolved at runtime. Edit by writing to <code className="font-mono">.env</code>{" "}
            until the singleton row ships.
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
              {SETTINGS_PREVIEW.map(([k, v]) => (
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
