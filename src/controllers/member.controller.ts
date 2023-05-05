import { Response } from "express";
import {
  searchUserByName,
  listGroupMembers,
  addMemberToGroup,
  removeMemberFromGroup,
} from "../services/member.service";
import { RequestExt } from "../interfaces/requestExt";

const searchUserByNameController = async (
  { query, user }: RequestExt,
  res: Response
) => {
  try {
    const { name } = query;
    const users = await searchUserByName(name as string, user?.id);
    res.status(200);
    res.send(users);
  } catch (error) {
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const getMembersController = async (
  { params, user }: RequestExt,
  res: Response
) => {
  try {
    const groupId = parseInt(params?.groupId);
    if (!groupId) {
      throw new Error("Invalid group id");
    }

    const members = await listGroupMembers(groupId, user?.id);

    res.status(200);
    res.send(members);
  } catch (error) {
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const createMemberController = async (
  { params, user, query }: RequestExt,
  res: Response
) => {
  try {
    const groupId = parseInt(params?.groupId);
    if (!groupId) {
      throw new Error("Invalid group id");
    }

    const userId = parseInt(params?.userId);

    if (!userId) {
      throw new Error("Invalid user id");
    }

    await addMemberToGroup(groupId, userId, user?.id);

    res.status(200);
    res.send({ message: "Member added" });
  } catch (error) {
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};
const deleteMemberController = async (
  { params, user }: RequestExt,
  res: Response
) => {
  try {
    const groupId = parseInt(params?.groupId);
    if (!groupId) {
      throw new Error("Invalid group id");
    }

    const userId = parseInt(params?.memberId);

    if (!userId) {
      throw new Error("Invalid user id");
    }

    await removeMemberFromGroup(groupId, userId, user?.id);

    res.status(200);
    res.send({ message: "Member removed" });
  } catch (error) {
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};

export {
  searchUserByNameController,
  getMembersController,
  createMemberController,
  deleteMemberController,
};
