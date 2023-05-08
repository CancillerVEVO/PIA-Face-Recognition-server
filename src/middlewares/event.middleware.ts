import { NextFunction, Request, Response } from "express";
import eventSchema from "../interfaces/event.interface";

const eventMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, groupId, endDate } = req.body;

    const result = eventSchema.safeParse({
      title,
      description,
      groupId,
      endDate,
    });

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues,
      });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default eventMiddleware;
