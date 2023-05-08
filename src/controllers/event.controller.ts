import { Response } from "express";
import { RequestExt } from "../interfaces/requestExt";
import {
  createEvent,
  getEventDetail,
  getEvents,
  editEvent,
  deleteEvent,
} from "../services/event.service";

const createEventController = async (
  { body, user }: RequestExt,
  res: Response
) => {
  try {
    const userId = user?.id;

    const newEvent = await createEvent(body, userId);

    res.status(200);
    res.send(newEvent);
  } catch (error) {
    console.error(error);

    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const getEventDetailController = async (
  { params, user }: RequestExt,
  res: Response
) => {
  try {
    const userId = user?.id;
    const eventId = parseInt(params?.eventId);
    if (!eventId) {
      throw new Error("Invalid event id");
    }

    const event = await getEventDetail(eventId, userId);

    res.status(200);
    res.send(event);
  } catch (error) {
    console.error(error);

    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const getEventsController = async (
  { params, user }: RequestExt,
  res: Response
) => {
  try {
    const userId = user?.id;
    const groupId: number = parseInt(params?.groupId);

    if (!groupId) {
      throw new Error("Invalid group id");
    }

    const events = await getEvents(userId, groupId);

    res.status(200);
    res.send(events);
  } catch (error) {
    console.error(error);

    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const editEventController = async (
  { body, params, user }: RequestExt,
  res: Response
) => {
  try {
    const userId = user?.id;
    const eventId = parseInt(params?.eventId);
    if (!eventId) {
      throw new Error("Invalid event id");
    }

    const updatedEvent = await editEvent(body, eventId, userId);

    res.status(200);
    res.send(updatedEvent);
  } catch (error) {
    console.error(error);

    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const deleteEventController = async (
  { params, user }: RequestExt,
  res: Response
) => {
  try {
    const userId = user?.id;
    const eventId = parseInt(params?.eventId);
    if (!eventId) {
      throw new Error("Invalid event id");
    }

    const deletedEvent = await deleteEvent(eventId, userId);

    res.status(200);
    res.send(deletedEvent);
  } catch (error) {
    console.error(error);
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};

export {
  createEventController,
  getEventDetailController,
  getEventsController,
  editEventController,
  deleteEventController,
};
