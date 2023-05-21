import { PrismaClient } from "@prisma/client";
import { Member } from "@prisma/client";

const prisma = new PrismaClient();

const USER_ROLE = 1;
const ADMIN_ROLE = 2;

const searchUserByName = async (name: string, userId: number) => {
  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: name,
      },
      AND: {
        id: {
          not: userId,
        },
      },
    },
    select: {
      id: true,
      username: true,
      email: true,
      imageUrl: true,
    },
  });

  return users;
};

const listGroupMembers = async (groupId: number, userId: number) => {
  const isMember = await prisma.member.findFirst({
    where: {
      groupId: groupId,
      userId: userId,
    },
  });
  if (!isMember) {
    throw new Error("You are not a member of this group");
  }

  const members = await prisma.member.findMany({
    where: {
      groupId: groupId,
    },
    include: {
      User: true,
      MemberRole: true,
      Group: true,
    },
  });

  const groupIsDeleted = members[0].Group.deletedAt != null;

  if (groupIsDeleted) {
    throw new Error("Group not found");
  }

  const cleanMembers = members.map((member) => {
    return {
      id: member.User.id,
      username: member.User.username,
      email: member.User.email,
      imageUrl: member.User.imageUrl,
      role: member.MemberRole.title,
      joinedAt: member.joinedAt,
    };
  });

  return cleanMembers;
};
const addMemberToGroup = async (
  groupId: number,
  userId: number,
  adminId: number
) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExists) {
    throw new Error("User not found");
  }

  const isAdmin = await prisma.member.findFirst({
    where: {
      groupId: groupId,
      userId: adminId,
      roleId: ADMIN_ROLE,
    },
    include: {
      Group: true,
    },
  });

  const groupIsDeleted = isAdmin?.Group.deletedAt != null;

  if (groupIsDeleted) {
    throw new Error("Group not found");
  }

  if (!isAdmin) {
    throw new Error("You are not an admin of this group");
  }

  const isMember = await prisma.member.findFirst({
    where: {
      groupId: groupId,
      userId: userId,
    },
  });

  if (isMember) {
    throw new Error("User is already a member of this group");
  }

  const member = await prisma.member.create({
    data: {
      groupId: groupId,
      userId: userId,
      roleId: USER_ROLE,
    },
  });

  return member;
};

const removeMemberFromGroup = async (
  groupId: number,
  memberId: number,
  adminId: number
) => {
  const isMember = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
    include: {
      Group: true,
    },
  });

  if (!isMember) {
    throw new Error("Member not found");
  }

  const groupIsDeleted = isMember.Group.deletedAt != null;

  if (groupIsDeleted) {
    throw new Error("Group not found");
  }

  const isAdmin = await prisma.member.findFirst({
    where: {
      groupId: groupId,
      userId: adminId,
      roleId: ADMIN_ROLE,
    },
    include: {
      Group: true,
    },
  });

  if (!isAdmin) {
    throw new Error("You are not an admin of this group");
  }

  const member = await prisma.member.delete({
    where: {
      id: memberId,
    },
  });

  return member;
};
export {
  searchUserByName,
  listGroupMembers,
  addMemberToGroup,
  removeMemberFromGroup,
};
