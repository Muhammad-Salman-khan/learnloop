/**
 * Internal API response helper.
 *
 * Use this for uniform responses from Server Actions, route handlers, and
 * service layers. The shape is fixed so consumers can pattern-match without
 * caring about the underlying transport.
 *
 * Conventions:
 *  - status: HTTP-style numeric status code (e.g. 200, 201, 400, 404, 500).
 *  - success: derived from status; callers can override either field and the
 *    other will be reconciled.
 *  - message: human-readable string — short, sentence-case, no trailing period
 *    (e.g. "Course created", "Invalid credentials").
 *  - error: optional developer-facing detail. Never leak stack traces or
 *    secrets here; sanitize before forwarding.
 *  - data: anything serializable. Generic on the call site preserves caller
 *    types; inferred as unknown when omitted.
 */

export type StatusCode =
  | 200
  | 201
  | 204
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 500;

export type ApiResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  error?: string;
  data?: T;
};

type BuildOptions<T> = {
  status?: number;
  success?: boolean;
  message: string;
  error?: string;
  data?: T;
};

const isRedirectStatus = (status: number): boolean =>
  status >= 300 && status < 400;

/**
 * Type-safe response helper. Synchronous — no async work needed unless
 * logging/sanitization is added later, in which case make it `async` and
 * update helpers at call sites in one pass.
 *
 * @example
 *   return ReturnResponse({ status: 200, message: "Course created", data });
 *   return ReturnResponse({ status: 401, message: "Unauthorized", error: "Invalid token" });
 */
export const ReturnResponse = <T = unknown>(options: BuildOptions<T>) => {
  const { status, success, message, error, data } = options;

  const resolvedStatus: number =
    typeof status === "number" ? status
    : success === false ? 400
    : 200;

  const resolvedSuccess: boolean =
    typeof success === "boolean" ? success : (
      resolvedStatus >= 200 && resolvedStatus < 300
    );

  return {
    status: resolvedStatus,
    success: !isRedirectStatus(resolvedStatus) && resolvedSuccess,
    message,
    error,
    data,
  };
};
