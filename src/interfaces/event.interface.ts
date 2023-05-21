import { z, ZodIssueCode } from "zod";

const eventSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(3).max(100),
  groupId: z.number(),
  endDate: z
    .string()
    .datetime()
    .superRefine((data, ctx) => {
      if (new Date(data) < new Date()) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: "End date must be greater than today",
          path: ["endDate"],
        });
      }
    }),
});

export default eventSchema;
