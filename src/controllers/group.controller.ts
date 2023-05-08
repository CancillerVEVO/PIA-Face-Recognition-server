import { RequestExt } from "../interfaces/requestExt";
import { Response } from "express";
import {
  createGroup,
  getGroupDetail,
  editGroup,
  deleteGroup,
  getGroups,
} from "../services/groups.service";

const createGroupController = async (
  { body, user }: RequestExt,
  res: Response
) => {
  try {
    const group = await createGroup(body, user?.id);

    res.status(200);
    res.send(group);
  } catch (e) {
    res.status(403);
    console.log(e);

    e instanceof Error
      ? res.json({ message: e.message })
      : res.json({ message: e });
  }
};
const getGroupDetailController = async (
  { user, params }: RequestExt,
  res: Response
) => {
  try {
    const groupId = parseInt(params?.id);
    if (!groupId) {
      throw new Error("Invalid group id");
    }
    const group = await getGroupDetail(groupId, user?.id);

    res.status(200);
    res.send(group);
  } catch (error) {
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const getGroupsController = async ({ user }: RequestExt, res: Response) => {
  try {
    const groups = await getGroups(user?.id);

    res.status(200);
    res.send(groups);
  } catch (error) {
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const updateGroupController = async (
  { body, user, params }: RequestExt,
  res: Response
) => {
  try {
    const groupId = parseInt(params?.id);
    if (!groupId) {
      throw new Error("Invalid group id");
    }

    const group = await editGroup(body, groupId, user?.id);

    res.status(200);
    res.send(group);
  } catch (error) {
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const deleteGroupController = async (
  { user, params }: RequestExt,
  res: Response
) => {
  try {
    const groupId = parseInt(params?.id);
    if (!groupId) {
      throw new Error("Invalid group id");
    }

    await deleteGroup(groupId, user?.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};

export {
  createGroupController,
  getGroupDetailController,
  updateGroupController,
  deleteGroupController,
  getGroupsController,
};
