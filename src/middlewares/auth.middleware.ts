import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../interfaces/auth.interface";
import { z, ZodIssueCode } from "zod";

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
  } catch (e) {
    console.log(e);
  }
};

export { registerMiddleware, loginMiddleware };
