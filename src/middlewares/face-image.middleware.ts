import { Request, Response, NextFunction } from "express";
import { uploadImageSchema } from "../interfaces/face-image.interface";

const uploadMiddleware = async (
  { file }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = uploadImageSchema.safeParse({
      file,
    });

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues,
      });
    }

    next();
  } catch (e) {}
};

export { uploadMiddleware };
