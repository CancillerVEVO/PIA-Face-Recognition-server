import { Router } from "express";
import {
  registerController,
  loginController,
  meController,
} from "../controllers/auth.controller";
import { registerMiddleware, loginMiddleware, checkJWT } from "../middlewares";

const router = Router();

router.post("/register", registerMiddleware, registerController);

router.post("/login", loginMiddleware, loginController);

router.get("/me", checkJWT, meController);

export { router };
