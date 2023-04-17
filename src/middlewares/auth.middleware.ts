import { Request, Response, NextFunction } from "express";
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

const registerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, passwordConfirmation } = req.body;

    const result = registerSchema.safeParse({
      username,
      email,
      password,
      passwordConfirmation,
    });

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues,
      });
    }

    next();
  } catch (e) {
    console.log(e);
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

const loginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues,
      });
    }

    next();
  } catch (e) {}
};

export { registerMiddleware, loginMiddleware };
