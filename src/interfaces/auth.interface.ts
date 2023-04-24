import { z, ZodIssueCode } from "zod";

const registerSchema = z
  .object({
    username: z
      .string({
        required_error: "Username is required",
      })
      .min(3)
      .max(20),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6)
      .max(20),
    passwordConfirmation: z
      .string({
        required_error: "Password confirmation is required",
      })
      .min(6)
      .max(20),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Password confirmation does not match",
        path: ["passwordConfirmation"],
      });
    }
  });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export { registerSchema, loginSchema };
