import { Response } from "express";
import { RequestExt } from "../interfaces/requestExt";
import {
  registerAttendance,
  listAttendance,
} from "../services/attendance.service";

const createAttendanceController = async (
  { params, user, file }: RequestExt,
  res: Response
) => {
  try {
    const eventId = parseInt(params?.eventId);
    const userId = user?.id;

    if (!eventId) {
      throw new Error("Invalid event id");
    }

    const attendance = await registerAttendance(file, userId, eventId);

    res.status(200);
    res.send(attendance);
  } catch (error) {
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const getAttendanceController = async (
  { params, user }: RequestExt,
  res: Response
) => {
  try {
    const userId = user?.id;
    const eventId = parseInt(params?.eventId);

    if (!eventId) {
      throw new Error("Invalid event id");
    }

    const attendance = await listAttendance(eventId, userId);

    res.status(200);
    res.send(attendance);
  } catch (error) {
    console.error(error);

    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};

export { createAttendanceController, getAttendanceController };
