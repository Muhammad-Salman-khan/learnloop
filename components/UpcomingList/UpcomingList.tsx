import Link from "next/link";
import {
  CalendarClock,
  ClipboardList,
  FileText,
  PenLine,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UpcomingItem } from "@/lib/dashboard/student-data";

type UpcomingListProps = {
  readonly items: ReadonlyArray<UpcomingItem>;
};

function KindIcon({ kind }: { kind: UpcomingItem["kind"] }) {
  const common = { className: "size-3.5", "aria-hidden": true } as const;
  if (kind === "quiz") return <PenLine {...common} />;
  if (kind === "live") return <CalendarClock {...common} />;
  if (kind === "exam") return <FileText {...common} />;
  return <ClipboardList {...common} />;
}

function kindLabel(kind: UpcomingItem["kind"]): string {
  if (kind === "quiz") return "Quiz";
  if (kind === "live") return "Live session";
  if (kind === "exam") return "Exam";
  return "Assignment";
}

export function UpcomingList({ items }: UpcomingListProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="font-display text-xl font-medium tracking-tight">
          This week
        </CardTitle>
        <CardDescription>
          Assignments, quizzes, and live sessions due in the next seven days.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 px-6 py-3.5"
            >
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <KindIcon kind={item.kind} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-medium leading-tight">
                    {item.title}
                  </p>
                  <Badge variant="outline" className="shrink-0 font-mono text-[10.5px]">
                    {kindLabel(item.kind)}
                  </Badge>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{item.course}</span>
                  <span className="font-mono uppercase tracking-wide">
                    {item.dueAt}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t bg-muted/30 px-6 py-3">
          <Link
            href="/dashboard/student/schedule"
            className="text-xs font-medium text-foreground/80 hover:text-foreground"
          >
            View full schedule
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default UpcomingList;
