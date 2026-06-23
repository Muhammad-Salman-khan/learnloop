"use client";

import { useCallback } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  notificationChannelLabels,
  notificationChannels,
  notificationEvents,
  notificationEventLabels,
  notificationsSchema,
  type ChannelMap,
  type NotificationGrid,
  type NotificationsFormValues,
} from "@/lib/settings/notifications-schema";
import { notificationsDefaults } from "@/lib/settings/settings-data";

// Client Component. Notification toggle matrix lives inside a
// @tanstack/react-form. Channel × event cells are nested-field toggles so
// the same onChange validator powers the whole grid; the per-channel rollup
// table reads form state via useStore(form.store, ...) so it re-renders
// only as the matrix changes.
export function SettingsNotifications() {
  const form = useForm({
    defaultValues: notificationsDefaults as NotificationsFormValues,
    validators: {
      onChange: notificationsSchema,
    },
    onSubmit: async ({ value }) => {
      const enabled = notificationEvents.reduce(
        (acc, ev) =>
          acc +
          notificationChannels.filter(
            (ch) => (value[ev] as unknown as ChannelMap)[ch]
          ).length,
        0
      );
      toast.success("Notification preferences saved", {
        description: `${enabled} active channel${enabled === 1 ? "" : "s"} across 4 categories`,
      });
    },
  });

  const handleSilence = useCallback(() => {
    const next: NotificationGrid = notificationEvents.reduce((acc, ev) => {
      acc[ev] = { email: false, push: false, sms: false };
      return acc;
    }, {} as NotificationGrid);
    form.reset(next as unknown as NotificationsFormValues);
    toast.info("Notifications silenced");
  }, [form]);

  const totals = useStore(form.store, (state) =>
    notificationChannels.map((channel) => ({
      channel,
      active: notificationEvents.filter(
        (ev) => (state.values[ev] as unknown as ChannelMap)[channel]
      ).length,
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Delivery matrix
        </p>
        <p className="max-w-[60ch] text-xs text-muted-foreground">
          Choose which event types reach you, and on which channel. Quiet
          hours and digest batching live in your phone OS settings.
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Event</TableHead>
              {notificationChannels.map((channel) => (
                <TableHead key={channel} className="text-right">
                  {notificationChannelLabels[channel]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {notificationEvents.map((event) => (
              <TableRow key={event}>
                <TableCell className="pl-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium leading-tight">
                      {notificationEventLabels[event]}
                    </span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                      {event}
                    </span>
                  </div>
                </TableCell>
                {notificationChannels.map((channel) => {
                  const path = `${event}.${channel}` as keyof NotificationsFormValues;
                  const id = `nt-${event}-${channel}`;
                  return (
                    <TableCell key={channel} className="text-right">
                      <form.Field name={path}>
                        {(field) => {
                          const checked = field.state.value as unknown as boolean;
                          return (
                            <label
                              htmlFor={id}
                              className="inline-flex items-center justify-end gap-2 cursor-pointer"
                            >
                              <span className="sr-only">
                                {notificationEventLabels[event]} via{" "}
                                {notificationChannelLabels[channel]}
                              </span>
                              <Switch
                                id={id}
                                size="sm"
                                checked={checked}
                                onCheckedChange={(v) =>
                                  field.handleChange(v as never)
                                }
                              />
                            </label>
                          );
                        }}
                      </form.Field>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Separator />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Channel</TableHead>
              <TableHead className="pr-6 text-right">Active events</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totals.map(({ channel, active }) => (
              <TableRow key={channel}>
                <TableCell className="pl-6 font-medium">
                  {notificationChannelLabels[channel]}
                </TableCell>
                <TableCell className="pr-6 text-right font-mono tabular-nums text-muted-foreground">
                  {active} of {notificationEvents.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" onClick={handleSilence}>
          Silence all
        </Button>
        <form.Subscribe
          selector={(s) => ({ canSubmit: s.canSubmit, is: s.isSubmitting })}
        >
          {({ canSubmit, is }) => (
            <Button
              type="submit"
              disabled={!canSubmit || is}
              onClick={() => void form.handleSubmit()}
            >
              <Save className="size-3.5" aria-hidden="true" />
              {is ? "Saving…" : "Save preferences"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}

export default SettingsNotifications;
