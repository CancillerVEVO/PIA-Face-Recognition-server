import { Request, Response } from "express";
import { RequestExt } from "../interfaces/requestExt";

const uploadFileController = async (req: RequestExt, res: Response) => {
  try {
    const user = req.user;
    res.status(200);
    res.send(user);
  } catch (e) {
    res.status(500);
  }
};

export { uploadFileController };
