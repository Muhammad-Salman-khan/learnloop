import Link from "next/link";
import { ClipboardList, PenLine, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UpcomingTeachingEvent } from "@/lib/dashboard/teacher-data";

type UpcomingTeachingListProps = {
  readonly items: ReadonlyArray<UpcomingTeachingEvent>;
};

function KindIcon({ kind }: { kind: UpcomingTeachingEvent["kind"] }) {
  const common = { className: "size-3.5", "aria-hidden": true } as const;
  if (kind === "quiz") return <PenLine {...common} />;
  if (kind === "live") return <Video {...common} />;
  return <ClipboardList {...common} />;
}

function humanDue(iso: string): string {
  const target = new Date(iso).getTime();
  const now = new Date("2026-06-25T09:00:00Z").getTime();
  const diffDays = Math.round((target - now) / 86_400_000);
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `In ${diffDays} days`;
}

function kindLabel(kind: UpcomingTeachingEvent["kind"]): string {
  if (kind === "quiz") return "Quiz";
  if (kind === "live") return "Live";
  return "Assignment";
}

export function UpcomingTeachingList({ items }: UpcomingTeachingListProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="font-display text-xl font-medium tracking-tight">
          Upcoming this week
        </CardTitle>
        <CardDescription>
          Assignment deadlines, live sessions, and quiz windows.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3 px-6 py-3.5">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <KindIcon kind={item.kind} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-medium leading-tight">
                    {item.title}
                  </p>
                  <Badge
                    variant="outline"
                    className="shrink-0 font-mono text-[10.5px]"
                  >
                    {kindLabel(item.kind)}
                  </Badge>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{item.courseCode}</span>
                  <span className="font-mono uppercase tracking-wide">
                    {humanDue(item.dueAt)}
                  </span>
                </div>
              </div>
              <Link
                href={item.href}
                className="shrink-0 self-center text-xs font-medium text-foreground/80 hover:text-foreground"
              >
                Open →
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default UpcomingTeachingList;
