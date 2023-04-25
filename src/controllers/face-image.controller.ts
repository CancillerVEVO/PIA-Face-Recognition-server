import { Response } from "express";
import { RequestExt } from "../interfaces/requestExt";
import { saveFaceData } from "../services/face-image.service";

const uploadFileController = async (
  { user, file }: RequestExt,
  res: Response
) => {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    const updatedUser = await saveFaceData(file, user?.id);

    res.status(200);
    res.send({
      message: "File uploaded successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500);
    e instanceof Error ? res.json({ message: e.message }) : res.json(e);
  }
};

export { uploadFileController };
