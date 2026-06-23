import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ActivityEntry } from "@/lib/dashboard/student-data";

type ActivityFeedProps = {
  readonly entries: ReadonlyArray<ActivityEntry>;
};

export function ActivityFeed({ entries }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="font-display text-xl font-medium tracking-tight">
          Recent activity
        </CardTitle>
        <CardDescription>
          Latest updates from your instructors and the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <ol className="-mx-2">
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className="relative flex gap-3 py-3 pl-6"
            >
              {index !== entries.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-7 h-[calc(100%-0.5rem)] w-px bg-border"
                />
              )}
              <span
                aria-hidden="true"
                className="absolute left-2 top-5 size-2 rounded-full bg-foreground"
              />
              <div className="flex flex-1 items-baseline justify-between gap-3">
                <p className="text-sm leading-snug">
                  <span className="font-medium">{entry.actor}</span>{" "}
                  <span className="text-muted-foreground">{entry.action}</span>{" "}
                  <span className="font-medium">{entry.target}</span>
                </p>
                <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {entry.at}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export default ActivityFeed;
