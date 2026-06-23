"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsProfile } from "@/components/SettingsProfile/SettingsProfile";
import { SettingsNotifications } from "@/components/SettingsNotifications/SettingsNotifications";
import { SettingsAppearance } from "@/components/SettingsAppearance/SettingsAppearance";
import { SettingsSecurity } from "@/components/SettingsSecurity/SettingsSecurity";
import { Toaster } from "sonner";

type SettingsTabId = "profile" | "notifications" | "appearance" | "security";

const TAB_IDS: ReadonlyArray<SettingsTabId> = [
  "profile",
  "notifications",
  "appearance",
  "security",
];

function readInitialTab(): SettingsTabId {
  if (typeof window === "undefined") return "profile";
  const hash = window.location.hash.slice(1);
  return (TAB_IDS as ReadonlyArray<string>).includes(hash)
    ? (hash as SettingsTabId)
    : "profile";
}

// Owns the active tab. Pages stay server-rendered; this client island only
// animates between panels. Hash deep-linking (#profile, #notifications, ...)
// is read once during initial state, then handled via standard anchor links.
export function SettingsTabs() {
  const initialTab = useMemo<SettingsTabId>(() => readInitialTab(), []);
  const [tab, setTab] = useState<SettingsTabId>(initialTab);

  return (
    <div className="space-y-8">
      <Toaster richColors position="top-right" />
      <Tabs
        value={tab}
        onValueChange={(v) => {
          if ((TAB_IDS as ReadonlyArray<string>).includes(v)) {
            setTab(v as SettingsTabId);
          }
        }}
        className="gap-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Tools
            </span>
            <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              Settings
            </h1>
            <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
              Manage your profile, notifications, appearance, and security. Changes
              are preview-only in this demo build.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <a href="/dashboard/student/profile">Open public profile</a>
          </Button>
        </div>

        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="font-display text-xl font-medium tracking-tight">
                Profile
              </CardTitle>
              <CardDescription>
                Your name, contact, and identity. Email and student ID are
                locked because they flow from auth and the registrar.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SettingsProfile />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="font-display text-xl font-medium tracking-tight">
                Notifications
              </CardTitle>
              <CardDescription>
                Choose which event types you want to receive, and on which channel.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SettingsNotifications />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="font-display text-xl font-medium tracking-tight">
                Appearance
              </CardTitle>
              <CardDescription>
                Theme, font scale, motion, and reading density preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SettingsAppearance />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="font-display text-xl font-medium tracking-tight">
                Security
              </CardTitle>
              <CardDescription>
                Change your password, review active sessions, or export your data.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SettingsSecurity />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsTabs;
