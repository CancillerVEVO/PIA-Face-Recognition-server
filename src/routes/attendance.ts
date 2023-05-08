import { Router } from "express";
import multer from "multer";
import { checkJWT } from "../middlewares";
import {
  createAttendanceController,
  getAttendanceController,
} from "../controllers/attendance.controller";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/:eventId", checkJWT, getAttendanceController);
router.post(
  "/:eventId",
  checkJWT,
  upload.single("filename"),
  createAttendanceController
);

export { router };
