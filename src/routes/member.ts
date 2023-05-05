import { Router } from "express";
import {
  searchUserByNameController,
  getMembersController,
  createMemberController,
  deleteMemberController,
} from "../controllers/member.controller";
import { checkJWT } from "../middlewares/";
const router = Router();

router.get("/search", checkJWT, searchUserByNameController);
router.get("/:groupId", checkJWT, getMembersController);
router.post("/:groupId/:userId", checkJWT, createMemberController);
router.delete("/:groupId/:memberId", checkJWT, deleteMemberController);

export { router };
