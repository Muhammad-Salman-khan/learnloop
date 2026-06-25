import { notFound } from "next/navigation";

import { PagePlaceholder } from "@/components/PagePlaceholder/PagePlaceholder";
import { placeholderSpecs } from "@/lib/dashboard/placeholder-data";

// Placeholder route for the Edit profile link in /dashboard/teacher/profile.
// Reusable SettingsTabs lives at /dashboard/student/settings and is tightly
// coupled to student defaults; reusing it for teachers needs SettingsProfile
// to be split out of student-specific fields. Until that work lands, render
// the editorial placeholder so the link resolves without 404.
const page = () => {
  // Reuse the student settings spec to keep the copy consistent across both
  // dashboards until a teacher-specific variant lands.
  const spec = placeholderSpecs["settings"];
  if (!spec) notFound();
  return (
    <PagePlaceholder
      {...spec}
      backHref="/dashboard/teacher"
      backLabel="Back to dashboard"
    />
  );
};

export default page;
