"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TeacherCourse } from "@/lib/dashboard/teacher-data";

type TeacherCoursesGridProps = {
  readonly courses: ReadonlyArray<TeacherCourse>;
};

type StatusFilter = "all" | "live" | "draft" | "archived";

function statusVariant(
  status: TeacherCourse["status"],
): "default" | "secondary" | "outline" {
  if (status === "live") return "secondary";
  if (status === "draft") return "outline";
  return "default";
}

// Client island: search + status filter + sort.
export function TeacherCoursesGrid({ courses }: TeacherCoursesGridProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<"updated" | "students" | "progress" | "alpha">(
    "updated",
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = courses.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q)
      );
    });
    next = [...next].sort((a, b) => {
      if (sort === "students") return b.students - a.students;
      if (sort === "progress") return b.progressPct - a.progressPct;
      if (sort === "alpha") return a.title.localeCompare(b.title);
      return (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });
    return next;
  }, [courses, query, filter, sort]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-80">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, code, or topic"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="students">Most students</SelectItem>
              <SelectItem value="progress">Highest progress</SelectItem>
              <SelectItem value="alpha">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild className="h-9 gap-2">
            <Link href="/dashboard/teacher/courses/new">
              <Plus className="size-3.5" aria-hidden="true" />
              New course
            </Link>
          </Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-sm text-muted-foreground">
              No courses match those filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-[10.5px]">
                    {course.code}
                  </Badge>
                  <Badge variant={statusVariant(course.status)}>
                    {course.status.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="font-display text-lg font-medium leading-tight tracking-tight">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <Metric label="students" value={course.students} />
                  <Metric label="materials" value={course.materials} />
                  <Metric label="quizzes" value={course.quizzes} />
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">Avg. progress</span>
                    <span className="font-mono">{course.progressPct}%</span>
                  </div>
                  <Progress value={course.progressPct} className="mt-1 h-1.5" />
                </div>
                <Button asChild variant="outline" className="w-full gap-1.5">
                  <Link href={`/dashboard/teacher/courses/${course.id}`}>
                    Open course
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-muted/30 px-2 py-2">
      <div className="font-display text-lg font-semibold leading-tight">
        {value}
      </div>
      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export default TeacherCoursesGrid;
