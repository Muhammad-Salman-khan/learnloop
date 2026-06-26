import Link from "next/link";
import { Megaphone, Pin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  type AdminAnnouncement,
  type AnnouncementTarget,
  adminAnnouncements,
  announcementTargetLabel,
  findUser,
} from "@/lib/admin/admin-data";
import { formatDateLong } from "@/lib/admin/formatters";

type AdminAnnouncementsListProps = {
  readonly items?: ReadonlyArray<AdminAnnouncement>;
  readonly compact?: boolean;
  readonly withActions?: boolean;
};

function targetVariant(target: AnnouncementTarget) {
  if (target === "all") return "default" as const;
  if (target === "students") return "secondary" as const;
  if (target === "teachers") return "outline" as const;
  return "ghost" as const;
}

function AnnouncementRow({
  item,
  withActions,
}: {
  item: AdminAnnouncement;
  withActions?: boolean;
}) {
  const author = findUser(item.authorUserId);
  return (
    <article className="flex flex-col gap-2 border-b px-5 py-4 last:border-b-0">
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.pinned ? (
              <Badge variant="outline" className="gap-1">
                <Pin className="size-2.5" />
                Pinned
              </Badge>
            ) : null}
            <Badge variant={targetVariant(item.target)}>
              {announcementTargetLabel(item.target)}
            </Badge>
          </div>
          <h3 className="font-display text-sm font-medium leading-tight">
            {item.title}
          </h3>
        </div>
        {withActions ? (
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={`/dashboard/admin/announcements/${item.id}/edit`}
              className="text-xs"
            >
              Edit
            </Link>
          </Button>
        ) : null}
      </header>

      <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
        {item.body}
      </p>

      <footer className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        <Megaphone className="size-2.5" />
        <span>{formatDateLong(item.publishedAt)}</span>
        <span aria-hidden="true">·</span>
        <Users className="size-2.5" />
        <span>{author?.name ?? "Admin"}</span>
      </footer>
    </article>
  );
}

// Server Component. Reused on the overview page (compact) and the
// /announcements index (full). When `items` is omitted we render the full
// stored list, ordered newest-first.
export function AdminAnnouncementsList({
  items,
  compact = false,
  withActions = false,
}: AdminAnnouncementsListProps) {
  const list =
    items ??
    [...adminAnnouncements].sort((a, b) =>
      a.publishedAt > b.publishedAt ? -1 : 1,
    );

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Announcements
          </span>
          <CardTitle className="mt-1 font-display text-lg font-medium">
            {compact ? "Latest announcements" : "All announcements"}
          </CardTitle>
          <CardDescription className="text-xs">
            {compact
              ? "Platform-wide communication visible to teachers and students."
              : "Create, edit, and pin announcements shown across the platform."}
          </CardDescription>
        </div>
        {!compact ? (
          <Button size="sm" asChild>
            <Link href="/dashboard/admin/announcements/new">
              New announcement
            </Link>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="max-h-96 overflow-auto">
          {list.length === 0 ? (
            <div className="px-5 py-8 text-center text-xs text-muted-foreground">
              No announcements yet.
            </div>
          ) : (
            list.map((item) => (
              <AnnouncementRow
                key={item.id}
                item={item}
                withActions={withActions}
              />
            ))
          )}
        </div>
      </CardContent>
      <CardContent />
    </Card>
  );
}

export default AdminAnnouncementsList;
