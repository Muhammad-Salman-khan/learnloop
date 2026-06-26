import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AnnouncementForm } from "@/components/AnnouncementForm/AnnouncementForm";

const page = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Announcements · Create
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          New announcement
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Publish to the entire platform or target a specific audience.
          Pinned posts stay at the top of every dashboard.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Compose
          </CardTitle>
          <CardDescription className="text-xs">
            Title and body are required. Audience and pin behaviour can be
            changed any time after publishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnnouncementForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
