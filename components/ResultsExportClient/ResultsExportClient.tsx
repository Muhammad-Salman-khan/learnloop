"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarRange, Download, FileText, Printer } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  adminCourses,
  findCourse,
  findUser,
  percentFromRow,
  resultRows,
  resultKindLabel,
} from "@/lib/staff/staff-data";
import { formatDateLong } from "@/lib/admin/formatters";

type ResultsExportClientProps = {
  readonly preselectedCourseId?: string;
  readonly preselectedStudentId?: string;
  readonly months: ReadonlyArray<string>;
};

// Monthly cycle labels are simple "YYYY-MM" strings in the dataset.
// We aggregate over the date range selected on the form. The default
// is the current month — represented by the most recent monthLabel in
// the seeded data so the demo lookup always has rows.
export function ResultsExportClient({
  preselectedCourseId,
  preselectedStudentId,
  months,
}: ResultsExportClientProps) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(preselectedCourseId ?? "");
  const [studentFilter, setStudentFilter] = useState(preselectedStudentId ?? "");
  const [fromMonth, setFromMonth] = useState(months[0] ?? "");
  const [toMonth, setToMonth] = useState(months[months.length - 1] ?? "");

  const filtered = useMemo(() => {
    return resultRows.filter((r) => {
      if (courseId && r.courseId !== courseId) return false;
      if (studentFilter && r.studentUserId !== studentFilter) return false;
      const monthKey = r.submittedOn.slice(0, 7);
      if (monthKey < fromMonth || monthKey > toMonth) return false;
      return true;
    });
  }, [courseId, studentFilter, fromMonth, toMonth]);

  function downloadCsv() {
    if (typeof window === "undefined") return;
    const header = [
      "course_code",
      "course_title",
      "student",
      "kind",
      "title",
      "score",
      "max_score",
      "percentage",
      "submitted_on",
    ];
    const lines = [header.join(",")];
    for (const r of filtered) {
      const c = findCourse(r.courseId);
      const u = findUser(r.studentUserId);
      lines.push(
        [
          c?.code ?? "",
          JSON.stringify(c?.title ?? ""),
          JSON.stringify(u?.name ?? ""),
          r.kind,
          JSON.stringify(r.title),
          r.score,
          r.maxScore,
          percentFromRow(r),
          r.submittedOn.slice(0, 10),
        ].join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnhub-results-${courseId || "all"}-${
      new Date().toISOString().slice(0, 10)
    }.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("CSV exported", {
      description: `${filtered.length} rows downloaded.`,
    });
  }

  function downloadPdf() {
    if (typeof window !== "undefined") {
      window.print();
      toast.success("Print dialog opened", {
        description: "Choose 'Save as PDF' to download the file.",
      });
    }
    return undefined;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Results
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Export results
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Filter results by course and date, then download as CSV for the
          spreadsheet or print a clean PDF result card.
        </p>
      </header>

      <Tabs defaultValue="csv">
        <TabsList className="grid w-full grid-cols-2 md:w-[420px]">
          <TabsTrigger value="csv">CSV download</TabsTrigger>
          <TabsTrigger value="pdf">Printable PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="csv" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg font-medium">
                <FileText className="size-4" />
                CSV export
              </CardTitle>
              <CardDescription className="text-xs">
                Spreadsheet-ready. The download includes a header row.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="course-export">Course</FieldLabel>
                    <FieldContent>
                      <Select value={courseId} onValueChange={setCourseId}>
                        <SelectTrigger id="course-export" className="h-9 w-full">
                          <SelectValue placeholder="All courses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All courses</SelectItem>
                          {adminCourses.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.code} · {c.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Leave empty to export the union of all courses.
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="from">From (YYYY-MM)</FieldLabel>
                    <FieldContent>
                      <Select value={fromMonth} onValueChange={setFromMonth}>
                        <SelectTrigger id="from" className="h-9 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="to">To (YYYY-MM)</FieldLabel>
                    <FieldContent>
                      <Select value={toMonth} onValueChange={setToMonth}>
                        <SelectTrigger id="to" className="h-9 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="student-export">
                    Student (optional)
                  </FieldLabel>
                  <FieldContent>
                    <Select
                      value={studentFilter}
                      onValueChange={setStudentFilter}
                    >
                      <SelectTrigger id="student-export" className="h-9 w-full">
                        <SelectValue placeholder="All students" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All students</SelectItem>
                        <SelectItem value={preselectedStudentId ?? ""}>
                          {preselectedStudentId
                            ? `Selected: ${preselectedStudentId}`
                            : "Selected"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </FieldGroup>

              <div className="flex flex-col gap-3">
                <Button onClick={downloadCsv} className="gap-1.5">
                  <Download className="size-3.5" />
                  Export {filtered.length} row{filtered.length === 1 ? "" : "s"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard/staff/results")}
                  className="self-start"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg font-medium">
                <Printer className="size-4" />
                Printable result card
              </CardTitle>
              <CardDescription className="text-xs">
                A PDF-ready view of the filtered results. Browser print
                supports{' '}
                <span className="font-mono text-foreground">
                  Save as PDF
                </span>{' '}
                out of the box.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <CalendarRange className="size-4 text-muted-foreground" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium">
                      {fromMonth} → {toMonth}
                    </span>
                    <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {courseId === "" ? "All courses" : findCourse(courseId)?.code ?? "—"}
                    </span>
                  </div>
                </div>
                <Button size="sm" onClick={downloadPdf}>
                  Open print dialog
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Student
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Kind</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Submitted
                    </TableHead>
                    <TableHead className="text-right pr-5">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="px-5 py-10 text-center text-xs text-muted-foreground"
                      >
                        Nothing matches the selected filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((r) => {
                      const c = findCourse(r.courseId);
                      const u = findUser(r.studentUserId);
                      const pct = percentFromRow(r);
                      return (
                        <TableRow key={r.id}>
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                                {c?.code ?? "—"}
                              </span>
                              <span className="text-xs">{c?.title ?? "—"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs md:table-cell">
                            {u?.name ?? "—"}
                          </TableCell>
                          <TableCell className="text-xs">{r.title}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant="outline"
                              className="h-5 text-[10.5px]"
                            >
                              {resultKindLabel(r.kind).toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                            {formatDateLong(r.submittedOn)}
                          </TableCell>
                          <TableCell className="pr-5 text-right">
                            <Badge
                              variant={pct >= 60 ? "secondary" : "destructive"}
                              className="font-mono"
                            >
                              {pct}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">
        Looking for a per-student export? Open any{" "}
        <Link
          href="/dashboard/staff/students"
          className="underline"
        >
          student profile
        </Link>{" "}
        and use the Results tab.
      </p>
    </div>
  );
}

export default ResultsExportClient;
