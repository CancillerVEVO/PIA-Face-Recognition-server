import { Router } from "express";
import {
  createEventController,
  getEventDetailController,
  getEventsController,
  editEventController,
  deleteEventController,
} from "../controllers/event.controller";
import eventMiddleware from "../middlewares/event.middleware";
import { checkJWT } from "../middlewares";

const router = Router();

router.post("/", checkJWT, eventMiddleware, createEventController);
router.put("/:eventId", checkJWT, eventMiddleware, editEventController);
router.delete("/:eventId", checkJWT, deleteEventController);
router.get("/:eventId", checkJWT, getEventDetailController);
router.get("/all/:groupId", checkJWT, getEventsController);
export { router };
