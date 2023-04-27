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
    res.send("File uploaded successfully");
  } catch (e) {
    console.log(e);
    res.status(500);
    e instanceof Error ? res.json(e.message) : res.json(e);
  }
};

const deleteFileController = async ({ user }: RequestExt, res: Response) => {
  try {
    await deleteFaceData(user?.id);

    res.status(200);
    res.send("File deleted successfully");
  } catch (e) {
    console.log(e);
    res.status(500);
    e instanceof Error ? res.send(e.message) : res.send(e);
  }
};

const recognizeFaceController = async (
  { user, file }: RequestExt,
  res: Response
) => {
  try {
    await recognizeFace(file, user?.id);
    res.sendStatus(200);
  } catch (e) {
    res.status(404);
    e instanceof Error ? res.send(e.message) : res.send(e);
  }
};

export { uploadFileController, deleteFileController, recognizeFaceController };
