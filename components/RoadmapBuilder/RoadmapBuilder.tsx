"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import type { RoadmapModule } from "@/lib/dashboard/teacher-data";

type RoadmapBuilderProps = {
  readonly courseId: string;
  readonly initial: ReadonlyArray<RoadmapModule>;
};

// Local mutation copy  -  we keep this list in React state so drag/drop works
// without hitting a server each swap. Real persistence lands in the API.
type DraftModule = RoadmapModule;

export function RoadmapBuilder({ courseId, initial }: RoadmapBuilderProps) {
  const [modules, setModules] = React.useState<DraftModule[]>(() => [
    ...initial,
  ]);
  const [editing, setEditing] = React.useState<DraftModule | null>(null);
  const [saving, setSaving] = React.useState(false);
  const dragIndex = React.useRef<number | null>(null);
  const dragOverIndex = React.useRef<number | null>(null);

  // Dirty flag is derived from a ref-comparison against the last-saved
  // baseline. We refresh the baseline on a successful save so the button
  // re-disables until the user makes more changes.
  const [baseline, setBaseline] = React.useState<ReadonlyArray<RoadmapModule>>(
    () => initial,
  );
  const dirty =
    modules.length !== baseline.length ||
    modules.some((m, i) => m !== baseline[i]);

  const onSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    // Refresh baseline so `dirty` flips to false until the next edit.
    setBaseline(modules.map((m) => ({ ...m })));
    toast.success("Roadmap saved", {
      description: `${modules.length} modules for ${courseId}`,
    });
  };

  const reorder = (from: number, to: number) => {
    setModules((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      // Renumber titles so the order stays visible: "1. Foo", "2. Bar"…
      return copy.map((m, i) => ({
        ...m,
        title: m.title.replace(/^\d+\.\s*/, `${i + 1}. `),
      }));
    });
  };

  const remove = (id: string) => {
    setModules((prev) =>
      prev
        .filter((m) => m.id !== id)
        .map((m, i) => ({
          ...m,
          title: m.title.replace(/^\d+\.\s*/, `${i + 1}. `),
        })),
    );
  };

  const add = () => {
    const id = `rm-new-${Date.now()}`;
    setModules((prev) => [
      ...prev,
      {
        id,
        title: `${prev.length + 1}. New module`,
        summary: "Add a one-line summary of what this module covers.",
        lessons: 4,
        minutes: 30,
      },
    ]);
  };

  const update = (next: DraftModule) => {
    setModules((prev) => prev.map((m) => (m.id === next.id ? next : m)));
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Drag to reorder. Click a module to edit. Hit save when you&apos;re done.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={add} className="gap-2">
            <Plus className="size-3.5" aria-hidden="true" />
            Module
          </Button>
          <Button onClick={onSave} disabled={saving || !dirty} className="gap-2">
            {saving ?
              <>
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                Saving…
              </>
            : (
              <>
                <Save className="size-3.5" aria-hidden="true" />
                Save roadmap
              </>
            )}
          </Button>
        </div>
      </div>

      <ol className="flex flex-col gap-2">
        {modules.length === 0 ?
          <li className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
            No modules yet. Click <strong>Module</strong> to add the first one.
          </li>
        : modules.map((m, index) => (
          <li
            key={m.id}
            draggable
            onDragStart={() => {
              dragIndex.current = index;
            }}
            onDragOver={(e) => {
              e.preventDefault();
              dragOverIndex.current = index;
            }}
            onDrop={() => {
              const from = dragIndex.current;
              const to = dragOverIndex.current;
              if (from === null || to === null || from === to) return;
              reorder(from, to);
              dragIndex.current = null;
              dragOverIndex.current = null;
            }}
            className="group flex items-start gap-3 rounded-lg border bg-card px-4 py-3 shadow-xs transition-colors hover:border-foreground/40"
          >
            <button
              type="button"
              aria-label="Drag to reorder"
              className="mt-1 cursor-grab text-muted-foreground active:cursor-grabbing"
            >
              <GripVertical className="size-4" aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-medium leading-tight">
                  {m.title}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10.5px]">
                    {m.lessons} lessons
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-[10.5px]">
                    {m.minutes} min
                  </Badge>
                </div>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {m.summary}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 self-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Dialog
                open={editing?.id === m.id}
                onOpenChange={(open) => setEditing(open ? m : null)}
              >
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Edit module">
                    <Pencil className="size-3.5" aria-hidden="true" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit module</DialogTitle>
                    <DialogDescription>
                      Changes apply to the local draft  -  press save to publish.
                    </DialogDescription>
                  </DialogHeader>
                  <RoadmapModuleEditor
                    module={editing ?? m}
                    onChange={(next) => update(next)}
                  />
                </DialogContent>
              </Dialog>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Delete module"
                onClick={() => remove(m.id)}
              >
                <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
              </Button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RoadmapModuleEditor({
  module,
  onChange,
}: {
  module: RoadmapModule;
  onChange: (next: RoadmapModule) => void;
}) {
  const [title, setTitle] = React.useState(module.title);
  const [summary, setSummary] = React.useState(module.summary);
  const [lessons, setLessons] = React.useState(String(module.lessons));
  const [minutes, setMinutes] = React.useState(String(module.minutes));
  const [titleErr, setTitleErr] = React.useState<string | null>(null);

  const apply = () => {
    if (!title.trim()) {
      setTitleErr("Title is required.");
      return;
    }
    onChange({
      ...module,
      title: `${module.title.match(/^\d+\./) ? module.title.match(/^\d+\./)![0] : ""} ${title.replace(/^\d+\.\s*/, "").trim()}`.trim(),
      summary: summary.trim() || module.summary,
      lessons: Number(lessons) || 1,
      minutes: Number(minutes) || 0,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Field className="gap-2">
        <FieldLabel htmlFor="rm-title">Title</FieldLabel>
        <Input
          id="rm-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleErr) setTitleErr(null);
          }}
        />
        <FieldError errors={titleErr ? [{ message: titleErr }] : undefined} />
      </Field>
      <Field className="gap-2">
        <FieldLabel htmlFor="rm-summary">Summary</FieldLabel>
        <Textarea
          id="rm-summary"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field className="gap-2">
          <FieldLabel htmlFor="rm-lessons">Lessons</FieldLabel>
          <Input
            id="rm-lessons"
            type="number"
            inputMode="numeric"
            value={lessons}
            onChange={(e) => setLessons(e.target.value)}
          />
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="rm-minutes">Minutes</FieldLabel>
          <Input
            id="rm-minutes"
            type="number"
            inputMode="numeric"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </Field>
      </div>
      <DialogFooter>
        <DialogTrigger asChild>
          <Button variant="outline">Cancel</Button>
        </DialogTrigger>
        <Button onClick={apply}>Apply</Button>
      </DialogFooter>
    </div>
  );
}

export default RoadmapBuilder;
