import { z } from "zod";

import { FEE_STATUSES } from "@/lib/admin/admin-data";

// Fee status update form schema. Fields are typed as if every input is
// required-and-string at the form boundary, because TanStack Form's
// `$strip` input type expects concrete values for every key.
const feeEnum = z.enum(
  FEE_STATUSES as unknown as [string, ...string[]],
);

export const feeStatusSchema = z.object({
  status: feeEnum,
  reason: z.string(),
});

export type FeeStatusFormValues = z.infer<typeof feeStatusSchema>;

export const bulkFeeStatusSchema = z.object({
  studentIds: z.array(z.string()),
  status: feeEnum,
  reason: z.string(),
});

export type BulkFeeStatusFormValues = z.infer<typeof bulkFeeStatusSchema>;
