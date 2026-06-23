// Extracts human-readable messages from TanStack Form's `field.state.meta.errors`
// array. TanStack Form's Standard Schema adapter (used when you pass a zod
// schema as a validator) deposits `StandardSchemaV1Issue` objects, not plain
// strings. Rendering those objects raw via `.toString()` produces strings like
// `"[object Object]"`. This helper normalises both shapes into `{ message }` so
// the shadcn `FieldError` component can render them correctly.
//
// Per AGENTS.md, the canonical read is "errors come from field.state.meta.errors[0]"
// — but the *typed* shape also lets us surface multiple errors per field via
// the `errors` prop on FieldError.
export type FieldErrorItem = { message?: string };

export type RawFieldError =
  | string
  | number
  | null
  | undefined
  | { message?: unknown; path?: unknown; [key: string]: unknown };

function readMessage(raw: unknown): string | undefined {
  if (raw === null || raw === undefined) return undefined;
  if (typeof raw === "string") return raw.length > 0 ? raw : undefined;
  if (
    typeof raw === "number" ||
    typeof raw === "boolean" ||
    typeof raw === "bigint"
  ) {
    return String(raw);
  }
  if (typeof raw === "object") {
    const obj = raw as { message?: unknown };
    if (typeof obj.message === "string" && obj.message.length > 0) {
      return obj.message;
    }
    if (typeof obj.message === "number") {
      return String(obj.message);
    }
  }
  return undefined;
}

// Convert a single, possibly-object, possibly-string error into FieldErrorItem.
export function toFieldErrorItem(raw: unknown): FieldErrorItem | undefined {
  const message = readMessage(raw);
  return message ? { message } : undefined;
}

// Convert an array of raw errors into the `{ message }[]` shape that the shadcn
// `FieldError` component expects via its `errors` prop.
export function toFieldErrorItems(
  rawErrors: ReadonlyArray<unknown>
): FieldErrorItem[] {
  const items: FieldErrorItem[] = [];
  for (const raw of rawErrors) {
    const item = toFieldErrorItem(raw);
    if (item) items.push(item);
  }
  return items;
}

// Convenience: returns the best string message from TanStack's errors array,
// or undefined. Use this when you only want a single inline message instead of
// the structured `errors` prop.
export function firstErrorMessage(
  rawErrors: ReadonlyArray<unknown>
): string | undefined {
  for (const raw of rawErrors) {
    const msg = readMessage(raw);
    if (msg) return msg;
  }
  return undefined;
}
