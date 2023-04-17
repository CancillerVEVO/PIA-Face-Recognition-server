import { Router } from "express";
import {
  registerController,
  loginController,
} from "../controllers/auth.controller";
import { registerMiddleware, loginMiddleware } from "../middlewares";

const router = Router();

router.post("/register", registerMiddleware, registerController);

router.post("/login", loginMiddleware, loginController);

export { router };
