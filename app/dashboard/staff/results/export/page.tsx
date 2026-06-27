import {
  ResultsExportClient,
} from "@/components/ResultsExportClient/ResultsExportClient";
import { resultRows } from "@/lib/staff/staff-data";

type Search = Promise<{ [key: string]: string | string[] | undefined }>;

const page = async ({ searchParams }: { searchParams: Search }) => {
  const params = await searchParams;
  const courseRaw = params.course;
  const studentRaw = params.student;
  const preselectedCourseId = Array.isArray(courseRaw)
    ? courseRaw[0]
    : courseRaw;
  const preselectedStudentId = Array.isArray(studentRaw)
    ? studentRaw[0]
    : studentRaw;

  const months = Array.from(
    new Set(resultRows.map((r) => r.submittedOn.slice(0, 7))),
  ).sort();

  return (
    <ResultsExportClient
      preselectedCourseId={preselectedCourseId}
      preselectedStudentId={preselectedStudentId}
      months={months}
    />
  );
};

export default page;
