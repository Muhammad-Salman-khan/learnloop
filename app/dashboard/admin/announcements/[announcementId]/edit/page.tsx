import { notFound } from "next/navigation";

import { findAnnouncement } from "@/lib/admin/admin-data";
import type { AnnouncementTarget } from "@/lib/admin/admin-data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnnouncementForm } from "@/components/AnnouncementForm/AnnouncementForm";

const page = ({
  params,
}: {
  params: Promise<{ announcementId: string }>;
}) => {
  return params.then(({ announcementId }) => {
    const announcement = findAnnouncement(announcementId);
    if (!announcement) notFound();

    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Announcements · Edit
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Edit announcement
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            Update title, body, audience, or pin state. The publish date
            doesn&apos;t change unless you re-run the publish action.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-medium">
              {announcement.title}
            </CardTitle>
            <CardDescription className="text-xs">
              Posted{" "}
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
              }).format(new Date(announcement.publishedAt))}{" "}
              · ID {announcement.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnnouncementForm
              mode="edit"
              defaults={{
                title: announcement.title,
                body: announcement.body,
                target: announcement.target as AnnouncementTarget,
                pinned: announcement.pinned,
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  });
};

export default page;
