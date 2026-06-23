"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  appearanceSchema,
  type AppearanceFormValues,
} from "@/lib/settings/appearance-schema";
import { appearanceDefaults } from "@/lib/settings/settings-data";

type Theme = AppearanceFormValues["theme"];
type Density = AppearanceFormValues["density"];

const densityOptions: ReadonlyArray<{ value: Density; label: string }> = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
];

const themes: ReadonlyArray<Theme> = ["light", "dark", "system"];

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "light") return <Sun className="size-3.5" aria-hidden="true" />;
  if (theme === "dark") return <Moon className="size-3.5" aria-hidden="true" />;
  return <Monitor className="size-3.5" aria-hidden="true" />;
}

// Client Component. Appearance preferences live in a @tanstack/react-form.
// Theme is a segment control bound to form.Field("theme"); font scale is a
// Slider; reduced motion is a Switch; density is a Select.
export function SettingsAppearance() {
  const form = useForm({
    defaultValues: appearanceDefaults as AppearanceFormValues,
    validators: {
      onChange: appearanceSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Appearance updated", {
        description: `${value.theme} theme, ${value.fontScale}% scale, ${value.density} density`,
      });
    },
  });

  return (
    <div className="space-y-6">
      <form.Subscribe selector={(s) => s.values.theme}>
        {(theme) => (
          <FieldGroup>
            <Field>
              <FieldLabel>Theme</FieldLabel>
              <FieldContent>
                <div className="inline-flex w-full gap-1 rounded-md bg-muted p-1 sm:w-fit">
                  {themes.map((option) => {
                    const active = option === theme;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={active}
                        onClick={() => form.setFieldValue("theme", option)}
                        className={
                          "inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium capitalize transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none " +
                          (active
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground")
                        }
                      >
                        <ThemeIcon theme={option} />
                        {option}
                      </button>
                    );
                  })}
                </div>
                <FieldDescription>
                  System follows your OS preference. Manual choices persist
                  across sessions.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        )}
      </form.Subscribe>

      <Separator />

      <form.Field
        name="fontScale"
        validators={{ onChange: appearanceSchema.shape.fontScale }}
      >
        {(field) => (
          <FieldGroup>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="ap-font-scale">Font scale</FieldLabel>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {field.state.value}%
                </span>
              </div>
              <FieldContent>
                <Slider
                  id="ap-font-scale"
                  value={[field.state.value]}
                  onValueChange={(v) => {
                    const next = Array.isArray(v) ? v[0] : v;
                    if (typeof next === "number") field.handleChange(next);
                  }}
                  min={85}
                  max={125}
                  step={5}
                />
                <FieldDescription>
                  Adjusts root font size. 100% is the default, 85% saves
                  space on dense lectures, 125% helps reading on tablets.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        )}
      </form.Field>

      <Separator />

      <form.Field
        name="reducedMotion"
        validators={{ onChange: appearanceSchema.shape.reducedMotion }}
      >
        {(field) => (
          <FieldGroup>
            <Field orientation="horizontal">
              <div className="flex flex-1 flex-col gap-1">
                <FieldLabel htmlFor="ap-reduced-motion">
                  Reduced motion
                </FieldLabel>
                <FieldDescription>
                  Disables non-essential transitions. Use this if motion
                  triggers dizziness or you prefer a calmer interface.
                </FieldDescription>
              </div>
              <Switch
                id="ap-reduced-motion"
                size="default"
                checked={field.state.value}
                onCheckedChange={(v) => field.handleChange(v)}
              />
            </Field>
          </FieldGroup>
        )}
      </form.Field>

      <Separator />

      <form.Field
        name="density"
        validators={{ onChange: appearanceSchema.shape.density }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="ap-density">Reading density</FieldLabel>
            <FieldContent>
              <Select
                value={field.state.value}
                onValueChange={(v) => field.handleChange(v as Density)}
              >
                <SelectTrigger id="ap-density" className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Choose density" />
                </SelectTrigger>
                <SelectContent>
                  {densityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Compact trims vertical padding across tables and cards.
                Comfortable increases it for extended reading.
              </FieldDescription>
            </FieldContent>
          </Field>
        )}
      </form.Field>

      <Separator />

      <form.Subscribe
        selector={(s) => ({
          theme: s.values.theme,
          fontScale: s.values.fontScale,
          reducedMotion: s.values.reducedMotion,
          density: s.values.density,
        })}
      >
        {(values) => (
          <section>
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Preview summary
            </p>
            <div className="mt-2 rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Setting</TableHead>
                    <TableHead className="pr-6">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="pl-6 font-medium">Theme</TableCell>
                    <TableCell className="pr-6 inline-flex items-center gap-2 capitalize">
                      <ThemeIcon theme={values.theme} />
                      {values.theme}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 font-medium">
                      Font scale
                    </TableCell>
                    <TableCell className="pr-6 font-mono tabular-nums">
                      {values.fontScale}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 font-medium">
                      Reduced motion
                    </TableCell>
                    <TableCell className="pr-6 font-mono tabular-nums">
                      {values.reducedMotion ? "On" : "Off"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 font-medium">
                      Density
                    </TableCell>
                    <TableCell className="pr-6 capitalize">
                      {values.density}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>
        )}
      </form.Subscribe>

      <div className="flex justify-end">
        <form.Subscribe
          selector={(s) => ({ canSubmit: s.canSubmit, is: s.isSubmitting })}
        >
          {({ canSubmit, is }) => (
            <Button
              type="submit"
              disabled={!canSubmit || is}
              onClick={() => void form.handleSubmit()}
            >
              {is ? "Saving…" : "Save appearance"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}

export default SettingsAppearance;
