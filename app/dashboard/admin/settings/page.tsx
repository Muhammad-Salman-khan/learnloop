import { Settings } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { platformSettings } from "@/lib/admin/admin-data";
import { PlatformSettingsForm } from "@/components/PlatformSettingsForm/PlatformSettingsForm";

const page = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Settings · General
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Platform settings
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Global toggles that affect every workspace. Changes save as draft
          until you press the button — there is no autosave.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 font-display text-lg font-medium">
            <Settings className="size-4 text-muted-foreground" />
            General
          </CardTitle>
          <CardDescription className="text-xs">
            Identity, language, capacity, and runtime flags for the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlatformSettingsForm defaults={platformSettings} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Danger zone
          </CardTitle>
          <CardDescription className="text-xs">
            Run destructive platform actions from a dedicated flow,
            confirmed by a typed phrase. Disabled in the demo build.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Reset demo data</p>
              <p className="text-xs text-muted-foreground">
                Restore every mocked record back to its factory seed.
              </p>
            </div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Demo only
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Wipe analytics history</p>
              <p className="text-xs text-muted-foreground">
                Drop event-log retention older than 12 months.
              </p>
            </div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Disabled
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
