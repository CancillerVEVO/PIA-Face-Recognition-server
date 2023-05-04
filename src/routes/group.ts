import { Router } from "express";
import {
  createGroupController,
  getGroupDetailController,
  updateGroupController,
  deleteGroupController,
  getGroupsController,
} from "../controllers/group.controller";
import { checkJWT, createGroupMiddleware } from "../middlewares/";
const router = Router();

// CREATE GROUP
router.post("/", checkJWT, createGroupMiddleware, createGroupController);

// GET GROUPS

router.get("/", checkJWT, getGroupsController);

// GET GROUP DETAILS
router.get("/:id", checkJWT, getGroupDetailController);

// UPDATE GROUP

router.put("/:id", checkJWT, createGroupMiddleware, updateGroupController);

// DELETE GROUP

router.delete("/:id", checkJWT, deleteGroupController);

export { router };
