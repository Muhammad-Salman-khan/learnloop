import {
  adminAnnouncements,
} from "@/lib/admin/admin-data";

import { AdminAnnouncementsList } from "@/components/AdminAnnouncementsList/AdminAnnouncementsList";

const page = () => {
  // Newest first — admin sees the most recent on top.
  const items = [...adminAnnouncements].sort((a, b) =>
    a.publishedAt > b.publishedAt ? -1 : 1,
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Announcements
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          All announcements
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Compose platform-wide notices and target them by audience. Pinned
          announcements appear at the top of every dashboard.
        </p>
      </header>

      <AdminAnnouncementsList items={items} withActions />
    </div>
  );
};

export default page;
