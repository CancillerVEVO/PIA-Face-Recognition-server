import { Router } from "express";
import { uploadFileController } from "../controllers/faceImage.controller";
import { checkJWT } from "../middlewares/session.middleware";
const router = Router();

router.post("/upload", checkJWT, uploadFileController);

export { router };
