import { Router } from "express";
import { checkJWT, uploadMiddleware } from "../middlewares/";
import { uploadFileController } from "../controllers/face-image.controller";
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

export { router };
