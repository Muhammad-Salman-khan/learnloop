"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, FileText, Search, Video, File as FileIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PdfUploadZone } from "@/components/PdfUploadZone/PdfUploadZone";
import type {
  MaterialKind,
  TeacherMaterial,
} from "@/lib/dashboard/teacher-data";
import { formatDateLong, relativeTime } from "@/lib/dashboard/date-utils";

type MaterialsListProps = {
  readonly courseId: string;
  readonly initial: ReadonlyArray<TeacherMaterial>;
};

function kindIcon(kind: MaterialKind) {
  if (kind === "video") return <Video className="size-3.5" aria-hidden="true" />;
  if (kind === "doc") return <FileIcon className="size-3.5" aria-hidden="true" />;
  return <FileText className="size-3.5" aria-hidden="true" />;
}

function formatSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function MaterialsList({ courseId, initial }: MaterialsListProps) {
  const [items, setItems] = useState<TeacherMaterial[]>(() => [...initial]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((m) => {
      if (!q) return true;
      return m.title.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q);
    });
  }, [items, query]);

  const handleUploaded = (file: { name: string; sizeKb: number }) => {
    // Push a fabricated entry to the table so the upload feels real.
    const id = `m-new-${Date.now()}`;
    setItems((prev) => [
      {
        id,
        courseId,
        title: file.name,
        kind: "pdf",
        sizeKb: file.sizeKb,
        uploadedAt: new Date().toISOString(),
        chunks: Math.max(60, Math.round(file.sizeKb / 4)),
        summary:
          "Auto-generated summary will appear here once the AI pass finishes.",
      },
      ...prev,
    ]);
  };

  return (
    <div className="flex flex-col gap-6">
      <PdfUploadZone onUploaded={handleUploaded} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-medium tracking-tight">
            All materials
          </h3>
          <div className="relative w-64 max-w-full">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search materials"
              className="h-9 pl-8 text-sm"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Chunks</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    No materials match that search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {kindIcon(m.kind)}
                        </span>
                        <span className="truncate text-sm font-medium">
                          {m.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase text-[10.5px]">
                        {m.kind}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatSize(m.sizeKb)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {m.chunks || " - "}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span title={formatDateLong(m.uploadedAt)}>
                        {relativeTime(m.uploadedAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline" className="gap-1.5">
                        <Link href={`/dashboard/teacher/courses/${courseId}/materials/${m.id}`}>
                          <Eye className="size-3.5" aria-hidden="true" />
                          Open
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default MaterialsList;
