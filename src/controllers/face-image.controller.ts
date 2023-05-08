import { Response } from "express";
import { RequestExt } from "../interfaces/requestExt";
import {
  saveFaceData,
  deleteFaceData,
  recognizeFace,
} from "../services/face-image.service";

const uploadFileController = async (
  { user, file }: RequestExt,
  res: Response
) => {
  try {
    await saveFaceData(file, user?.id);

    res.status(200);
    res.json({ message: "File uploaded successfully" });
  } catch (e) {
    res.status(500);
    e instanceof Error
      ? res.json({ message: e.message })
      : res.json({ message: e });
  }
};

const deleteFileController = async ({ user }: RequestExt, res: Response) => {
  try {
    await deleteFaceData(user?.id);

    res.status(200);
    res.send({ message: "File deleted successfully" });
  } catch (e) {
    res.status(404);
    e instanceof Error
      ? res.json({ message: e.message })
      : res.json({ message: e });
  }
};

const recognizeFaceController = async (
  { user, file }: RequestExt,
  res: Response
) => {
  try {
    const data = await recognizeFace(file, user?.id);
    res.status(200);
    res.send(data);
  } catch (e) {
    res.status(404);
    e instanceof Error
      ? res.json({ message: e.message })
      : res.json({ message: e });
  }
};

export { uploadFileController, deleteFileController, recognizeFaceController };
