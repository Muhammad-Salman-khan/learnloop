import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { CourseDetailHeader } from "@/components/CourseDetailHeader/CourseDetailHeader";
import { findCourse } from "@/lib/dashboard/teacher-data";

// Server Component layout for any /dashboard/teacher/courses/[courseId]/* route.
// Guards against missing slugs by throwing notFound()  -  Next.js renders the 404 page.
const CourseLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();

  return (
    <>
      <CourseDetailHeader course={course} />
      <main className="flex-1">{children}</main>
    </>
  );
};

export default CourseLayout;
