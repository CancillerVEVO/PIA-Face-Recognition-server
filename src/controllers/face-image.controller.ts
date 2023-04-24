import { Response } from "express";
import { RequestExt } from "../interfaces/requestExt";
import { uploadFaceData } from "../services/face-image.service";

const uploadFileController = async (req: RequestExt, res: Response) => {
  try {
    const user = req.user;
    const file = req.file;

    if (!file) {
      throw new Error("No file uploaded");
    }

    const url = await uploadFaceData(file);

    res.status(200).json({ user, url });
  } catch (e) {
    console.log(e);
    res.status(500);
    e instanceof Error ? res.json({ message: e.message }) : res.json(e);
  }
};

export { uploadFileController };
