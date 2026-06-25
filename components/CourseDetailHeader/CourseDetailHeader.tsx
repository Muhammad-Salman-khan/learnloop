"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Pencil,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { TeacherCourse } from "@/lib/dashboard/teacher-data";

type CourseDetailHeaderProps = {
  readonly course: TeacherCourse;
};

type NavLink = {
  readonly label: string;
  readonly href: string;
  readonly icon: typeof BookOpen;
};

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Client island because it depends on usePathname() to highlight the active tab.
// Receives the course as a prop (already resolved by the Server Component layout).
export function CourseDetailHeader({ course }: CourseDetailHeaderProps) {
  const pathname = usePathname() ?? "";
  const base = `/dashboard/teacher/courses/${course.id}`;
  const links: ReadonlyArray<NavLink> = [
    { label: "Overview", href: base, icon: BookOpen },
    {
      label: "Edit",
      href: `${base}/edit`,
      icon: Pencil,
    },
    {
      label: "Roadmap",
      href: `${base}/roadmap`,
      icon: Sparkles,
    },
    {
      label: "Materials",
      href: `${base}/materials`,
      icon: FileText,
    },
    {
      label: "Students",
      href: `${base}/students`,
      icon: Users,
    },
    {
      label: "Assignments",
      href: `${base}/assignments`,
      icon: ClipboardList,
    },
  ];

  return (
    <header className="border-b bg-background/95 px-4 backdrop-blur md:px-8">
      <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono text-[11px]">
            {course.code}
          </Badge>
          <div className="min-w-0">
            <h1 className="font-display text-xl font-medium leading-tight tracking-tight md:text-2xl">
              {course.title}
            </h1>
            <p className="truncate text-xs text-muted-foreground md:text-sm">
              {course.subtitle}
            </p>
          </div>
        </div>
        <span className="hidden md:block">
          <Badge
            variant={course.status === "live" ? "secondary" : "outline"}
            className="ml-auto"
          >
            {course.status.toUpperCase()}
          </Badge>
        </span>
      </div>
      <Separator />
      <nav
        className="-mb-px flex gap-1 overflow-x-auto"
        aria-label="Course sections"
      >
        {links.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="size-3.5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export default CourseDetailHeader;
