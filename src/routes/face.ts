import { Router } from "express";
import { checkJWT, uploadMiddleware } from "../middlewares/";
import {
  uploadFileController,
  deleteFileController,
} from "../controllers/face-image.controller";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  upload.single("filename"),
  checkJWT,
  uploadMiddleware,
  uploadFileController
);

router.delete("/", checkJWT, deleteFileController);

router.post("/recognition", checkJWT);

export { router };
