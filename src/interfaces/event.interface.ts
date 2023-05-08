import { z, ZodIssueCode } from "zod";

const eventSchema = z
  .object({
    title: z.string().min(3).max(50),
    description: z.string().min(3).max(100),
    groupId: z.number(),
    endDate: z.string({
      required_error: "End date is required",
    }),
  })
  .superRefine((data, ctx) => {
    const regEx = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    const date = new Date(`${data.endDate}`);

    if (!regEx.test(data.endDate)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "End date must be in MM/DD/YYYY format",
        path: ["endDate"],
      });
    }
    if (date < new Date()) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "End date must be greater than today",
        path: ["endDate"],
      });
    }
  });

export default eventSchema;
