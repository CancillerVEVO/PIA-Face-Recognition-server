import { Request, Response, NextFunction } from "express";
import { createGroupSchema } from "../interfaces/groups.interface";

const createGroupMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;

    const result = createGroupSchema.safeParse({
      title,
      description,
    });

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues,
      });
    }

    next();
  } catch (e) {
    res.sendStatus(500);
  }
};

export { createGroupMiddleware };
