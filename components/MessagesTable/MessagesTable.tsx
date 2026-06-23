import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MessageThread } from "@/lib/dashboard/student-data";

type MessagesTableProps = {
  readonly threads: ReadonlyArray<MessageThread>;
};

function kindVariant(kind: MessageThread["kind"]): "secondary" | "outline" {
  return kind === "course" ? "secondary" : "outline";
}

function kindLabel(kind: MessageThread["kind"]): string {
  return kind === "course" ? "Course thread" : "Direct";
}

function initials(name: string): string {
  return name
    .replace(/[·]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Messages page. Server Component. Avatar + shadcn Table.
export function MessagesTable({ threads }: MessagesTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 border-b sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Workspace
          </span>
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Inbox
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Direct messages with instructors and shared course threads. Unread
            counts sort rows to the top.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[42%]">Thread</TableHead>
              <TableHead className="hidden md:table-cell">Preview</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="pr-6 text-right">Unread</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {threads.map((thread) => (
              <TableRow key={thread.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="sm"
                      aria-hidden="true"
                      className="ring-1 ring-foreground/10"
                    >
                      <AvatarFallback>{initials(thread.counterpart)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium leading-tight">
                          {thread.counterpart}
                        </span>
                        <Badge variant={kindVariant(thread.kind)}>
                          {kindLabel(thread.kind)}
                        </Badge>
                      </div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        {thread.context}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  <span className="line-clamp-2 max-w-[60ch]">
                    {thread.preview}
                  </span>
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                  {thread.updatedAt}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  {thread.unread > 0 ? (
                    <Badge variant="default">{thread.unread} new</Badge>
                  ) : (
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      read
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default MessagesTable;
