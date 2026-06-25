import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, MessageSquare, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  findCourse,
  findMaterial,
  pdfChatByMaterial,
  pdfQuizzesByMaterial,
} from "@/lib/dashboard/teacher-data";

type Params = { courseId: string; materialId: string };

const CourseMaterialDetailPage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { courseId, materialId } = await params;
  const material = findMaterial(materialId);
  if (!material) notFound();
  const course = findCourse(material.courseId);
  if (!course) notFound();
  const chat = pdfChatByMaterial[materialId] ?? [];
  const quizzes = pdfQuizzesByMaterial[materialId] ?? [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href={`/dashboard/teacher/courses/${courseId}/materials`}>
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to materials
        </Link>
      </Button>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>{course.code}</span>
              <span aria-hidden="true">·</span>
              <span>{material.kind}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {(material.sizeKb / 1024).toFixed(2)} MB
              </span>
            </div>
            <CardTitle className="font-display text-2xl font-medium tracking-tight">
              {material.title}
            </CardTitle>
            <p className="max-w-[60ch] text-sm text-muted-foreground">
              {material.summary}
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Uploaded
            </p>
            <p className="text-sm font-mono tabular-nums">
              {new Date(material.uploadedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Chunks
            </p>
            <p className="text-sm font-mono tabular-nums">
              {material.chunks > 0 ? material.chunks : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Kind
            </p>
            <Badge variant="outline">{material.kind}</Badge>
          </div>
        </CardContent>
      </Card>

      {chat.length > 0 ? (
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="font-display text-xl font-medium tracking-tight">
              <span className="inline-flex items-center gap-2">
                <MessageSquare
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                AI chat on this material
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Cached turns from the PDF chat tool. Open the full reader for a
              live session.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <ol className="space-y-4">
              {chat.map((turn) => (
                <li
                  key={turn.id}
                  className="grid grid-cols-[5rem,1fr] gap-3 text-sm"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {turn.role}
                  </span>
                  <div className="space-y-1">
                    <p className="leading-relaxed">{turn.content}</p>
                    {turn.citations?.length ? (
                      <ul className="space-y-0.5 text-xs text-muted-foreground">
                        {turn.citations.map((c, idx) => (
                          <li key={idx} className="font-mono">
                            p. {c.page} —{" "}
                            <span className="italic">{c.quote}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      ) : null}

      {quizzes.length > 0 ? (
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="font-display text-xl font-medium tracking-tight">
              <span className="inline-flex items-center gap-2">
                <Sparkles
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                Cached quiz generators
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Quiz drafts already generated from this material. Open the AI
              tools workspace to generate a fresh batch.
            </p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Title</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Difficulty
                  </TableHead>
                  <TableHead className="text-right">MCQ</TableHead>
                  <TableHead className="text-right">T/F</TableHead>
                  <TableHead className="pr-6 text-right">Short</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="pl-6">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium leading-tight">
                          {q.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Generated{" "}
                          {new Date(q.generatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{q.difficulty}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {q.mcqCount}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {q.trueFalseCount}
                    </TableCell>
                    <TableCell className="pr-6 text-right font-mono tabular-nums">
                      {q.shortAnswerCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      <Separator />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/teacher/courses/${courseId}/materials`}>
            <FileText className="size-3.5" aria-hidden="true" />
            All materials
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/teacher/ai-tools`}>
            <Sparkles className="size-3.5" aria-hidden="true" />
            Open AI tools
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CourseMaterialDetailPage;
