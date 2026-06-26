import { z } from "zod";

// Schemas for the teacher Quizzes workspace.
//
// SSOT note: data fixtures live in `lib/dashboard/teacher-data.ts`. The
// schemas here describe *form* state the teacher authors — they are not
// derived from the fixtures by design (the form can describe a quiz that
// does not exist yet).
//
// Mounted as `onChange` / `onSubmit` validators on the TanStack Form
// instances in:
//   - components/QuizCreateDialog/QuizCreateDialog.tsx (new quiz)
//   - components/QuizEditor/QuizEditor.tsx (questions editor)

// ---------- Question blocks ----------

// One MCQ block. Exactly 2-6 options, one with `isCorrect` true.
export const mcqOptionSchema = z.object({
  id: z.string(),
  text: z
    .string()
    .min(1, "Option text required.")
    .max(160, "Option text is too long."),
  isCorrect: z.boolean(),
});

export const mcqQuestionSchema = z.object({
  id: z.string(),
  kind: z.literal("mcq"),
  prompt: z
    .string()
    .min(8, "Prompt must be at least 8 characters.")
    .max(800, "Prompt must be 800 characters or fewer."),
  options: z
    .array(mcqOptionSchema)
    .min(2, "Add at least two options.")
    .max(6, "Use six or fewer options per question."),
  points: z
    .number({ message: "Enter the points for this question." })
    .int("Points must be a whole number.")
    .min(1, "At least one point.")
    .max(100, "100 or fewer points."),
}).refine(
  (q) => q.options.some((o) => o.isCorrect),
  { message: "Mark at least one option as correct.", path: ["options"] },
);

// One true/false block.
export const trueFalseQuestionSchema = z.object({
  id: z.string(),
  kind: z.literal("truefalse"),
  prompt: z
    .string()
    .min(8, "Prompt must be at least 8 characters.")
    .max(400, "Prompt must be 400 characters or fewer."),
  correctAnswer: z.enum(["true", "false"]),
  points: z
    .number({ message: "Enter the points for this question." })
    .int("Points must be a whole number.")
    .min(1, "At least one point.")
    .max(100, "100 or fewer points."),
});

// One short-answer block. Marked answer is optional — instructors grade
// short answers manually.
export const shortAnswerQuestionSchema = z.object({
  id: z.string(),
  kind: z.literal("short"),
  prompt: z
    .string()
    .min(8, "Prompt must be at least 8 characters.")
    .max(400, "Prompt must be 400 characters or fewer."),
  suggestedAnswer: z
    .string()
    .max(400, "Suggested answer is too long.")
    .optional(),
  points: z
    .number({ message: "Enter the points for this question." })
    .int("Points must be a whole number.")
    .min(1, "At least one point.")
    .max(100, "100 or fewer points."),
});

export const anyQuestionSchema = z.discriminatedUnion("kind", [
  mcqQuestionSchema,
  trueFalseQuestionSchema,
  shortAnswerQuestionSchema,
]);
export type AnyQuestion = z.infer<typeof anyQuestionSchema>;

// ---------- Quiz editor (the questions form) ----------

export const quizEditorSchema = z.object({
  title: z
    .string()
    .min(4, "Quiz title must be at least 4 characters.")
    .max(120, "Quiz title must be 120 characters or fewer."),
  courseId: z.string().min(1, "Pick a course."),
  questions: z
    .array(anyQuestionSchema)
    .min(1, "Add at least one question before saving.")
    .max(200, "200 or fewer questions per quiz."),
});
export type QuizEditorValues = z.infer<typeof quizEditorSchema>;

// ---------- New-quiz dialog (the lightweight form) ----------

// Used by the Add-quiz dialog on the Quizzes index. Save here creates a draft
// quiz with no questions — the teacher opens the editor to add questions.
export const quizCreateSchema = z.object({
  title: z
    .string()
    .min(4, "Quiz title must be at least 4 characters.")
    .max(120, "Quiz title must be 120 characters or fewer."),
  courseId: z.string().min(1, "Pick a course."),
  status: z.enum(["draft", "published", "archived"]),
  durationMin: z
    .number({ message: "Enter a duration." })
    .int("Duration must be a whole number of minutes.")
    .min(5, "At least 5 minutes.")
    .max(240, "240 or fewer minutes."),
});
export type QuizCreateValues = z.infer<typeof quizCreateSchema>;

export const quizCreateDefaults: QuizCreateValues = {
  title: "",
  courseId: "",
  status: "draft",
  durationMin: 20,
};

// Defaults for the editor — one empty MCQ so the form has something to show.
export const emptyMcqDraft = (): {
  id: string;
  kind: "mcq";
  prompt: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  points: number;
} => ({
  id: cryptoRandom(),
  kind: "mcq",
  prompt: "",
  options: [
    { id: cryptoRandom(), text: "", isCorrect: false },
    { id: cryptoRandom(), text: "", isCorrect: false },
  ],
  points: 1,
});

export const quizEditorDefaults = (
  courseIdHint = "",
): QuizEditorValues => ({
  title: "",
  courseId: courseIdHint,
  questions: [emptyMcqDraft()],
});

// crypto.randomUUID() is available in modern browsers and Node 19+; this
// wrapper keeps the import-free pattern used elsewhere in this codebase.
function cryptoRandom(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
