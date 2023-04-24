import { Request, Response, Router } from "express";
import { checkJWT } from "../middlewares/";
import multer from "multer";
import { uploadFileController } from "../controllers/face-image.controller";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  upload.single("filename"),
  checkJWT,
  uploadFileController
);

export { router };
