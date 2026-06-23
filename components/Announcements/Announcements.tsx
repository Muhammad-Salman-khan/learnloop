import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Announcement } from "@/lib/dashboard/student-data";

type AnnouncementsProps = {
  readonly items: ReadonlyArray<Announcement>;
};

export function Announcements({ items }: AnnouncementsProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="font-display text-xl font-medium tracking-tight">
          Announcements
        </CardTitle>
        <CardDescription>
          From your instructors, the registrar, and student services.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="py-4 first:pt-4 last:pb-0">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-semibold leading-snug">
                  {item.title}
                </h3>
                <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                  {item.postedAt}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="text-foreground/70">Posted by</span>{" "}
                {item.postedBy}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-2 border-t pt-4">
          <Link
            href="/dashboard/student/messages"
            className="text-xs font-medium text-foreground/80 hover:text-foreground"
          >
            Open inbox
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default Announcements;
