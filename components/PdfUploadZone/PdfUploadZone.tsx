"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  FileText,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PdfUploadZoneProps = {
  readonly onUploaded: (file: { name: string; sizeKb: number }) => void;
};

type PendingFile = {
  readonly name: string;
  readonly sizeKb: number;
};

// Drag-and-drop upload zone. We mock the upload with a timeout so the rest
// of the UI can demonstrate the post-upload state without an actual server.
export function PdfUploadZone({ onUploaded }: PdfUploadZoneProps) {
  const [dragOver, setDragOver] = React.useState(false);
  const [pending, setPending] = React.useState<PendingFile | null>(null);
  const [busy, setBusy] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const beginUpload = (file: File) => {
    const meta = {
      name: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
    };
    setPending(meta);
    setBusy(true);
    // Simulate upload + AI ingestion.
    window.setTimeout(() => {
      setBusy(false);
      setPending(null);
      onUploaded(meta);
      toast.success("Material indexed", {
        description: `${meta.name} · summary ready.`,
      });
    }, 1300);
  };

  const onPick = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const first = files[0];
    if (!first) return;
    if (first.size > 25 * 1024 * 1024) {
      toast.error("File too large", { description: "25 MB max for the demo." });
      return;
    }
    beginUpload(first);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onPick(e.dataTransfer.files);
      }}
      className={[
        "relative flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-card px-6 py-12 text-center transition-colors",
        dragOver
          ? "border-foreground bg-muted/40"
          : "border-border hover:bg-muted/30",
      ].join(" ")}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <UploadCloud className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-medium">Drop a PDF or click to choose</p>
        <p className="text-xs text-muted-foreground">
          We&apos;ll auto-summarise and prepare it for chat & quiz generation.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ?
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Uploading…
            </>
          : "Choose file"}
        </Button>
        <Badge variant="outline" className="font-mono text-[10.5px]">
          PDF · max 25 MB
        </Badge>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={(e) => onPick(e.target.files)}
      />
      {pending && (
        <div className="absolute right-3 top-3 flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs shadow-xs">
          <FileText className="size-3.5" aria-hidden="true" />
          <span className="max-w-[16ch] truncate">{pending.name}</span>
          <button
            type="button"
            aria-label="Cancel upload"
            onClick={() => setPending(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default PdfUploadZone;
