import { PrismaClient } from "@prisma/client";
import { Group } from "@prisma/client";

const prisma = new PrismaClient();

const createGroup = async (
  { title, description }: Group,
  createdBy: number
) => {
  const group = await prisma.group.create({
    data: {
      title: title,
      description: description,
      createdBy: createdBy,
    },
  });

  await prisma.member.create({
    data: {
      userId: createdBy,
      groupId: group.id,
      roleId: 2,
    },
  });

  const cleanGroup = {
    id: group.id,
    title: group.title,
    description: group.description,
    createdAt: group.createdAt,
  };

  return cleanGroup;
};
const getGroupDetail = async (id: number, userId: number) => {
  const group = await prisma.group.findUnique({
    where: {
      id: id,
    },
    include: {
      Event: {
        orderBy: {
          startDate: "asc",
        },
      },
    },
  });

  if (!group || group.deletedAt != null) {
    throw new Error("Group not found");
  }

  const isInGroup = await prisma.member.findFirst({
    where: {
      groupId: id,
      userId: userId,
    },
  });

  if (!isInGroup) {
    throw new Error("You are not a member of this group");
  }

  const members = await prisma.member.findMany({
    where: {
      groupId: id,
    },
    include: {
      User: true,
      MemberRole: true,
    },
  });

  const cleanGroup = {
    id: group.id,
    title: group.title,
    description: group.description,
    createdAt: group.createdAt,
    currentUserRole: group.createdBy == userId ? "ADMIN" : "MEMBER",

    events:
      group.Event.map((event) => {
        return {
          id: event.id,
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
        };
      }) || [],
    members:
      members.map((member) => {
        return {
          id: member.id,
          username: member.User.username,
          email: member.User.email,
          imageUrl: member.User.imageUrl,
          joinedAt: member.joinedAt,
          role: member.MemberRole.title,
        };
      }) || [],
  };

  return { group: cleanGroup };
};

const editGroup = async (
  { title, description }: Group,
  id: number,
  userId: number
) => {
  const groupExists = await prisma.group.findUnique({
    where: {
      id: id,
    },
  });

  if (!groupExists || groupExists.deletedAt != null) {
    throw new Error("Group not found");
  }

  const isMember = await prisma.member.findFirst({
    where: {
      groupId: id,
      userId: userId,
    },
    include: {
      MemberRole: true,
    },
  });

  if (!isMember) {
    throw new Error("You are not a member of this group");
  }

  if (isMember.MemberRole.title != "ADMIN") {
    throw new Error("You are not an admin of this group");
  }

  const group = await prisma.group.update({
    where: {
      id: id,
    },
    data: {
      title,
      description,
    },
  });

  const cleanGroup = {
    id: group.id,
    title: group.title,
    description: group.description,
    createdAt: group.createdAt,
  };
  return cleanGroup;
};
const getGroups = async (userId: number) => {
  const groupIsMember = await prisma.member.findMany({
    where: {
      userId: userId,
    },

    include: {
      Group: true,
      MemberRole: true,
    },
  });

  const cleanGroup = groupIsMember
    .filter((group) => {
      return group.Group.deletedAt == null;
    })
    .map((group) => {
      return {
        id: group.Group.id,
        title: group.Group.title,
        description: group.Group.description,
        createdAt: group.Group.createdAt,
        role: group.MemberRole.title,
      };
    });

  const admin = cleanGroup.filter((group) => {
    return group.role == "ADMIN";
  });

  const member = cleanGroup.filter((group) => {
    return group.role == "MEMBER";
  });
  return { groups: { admin, member } };
};

const deleteGroup = async (id: number, userId: number) => {
  const group = await prisma.group.findUnique({
    where: {
      id: id,
    },
  });

  if (!group || group.deletedAt != null) {
    throw new Error("Group not found");
  }

  const isMember = await prisma.member.findFirst({
    where: {
      groupId: id,
      userId: userId,
    },
    include: {
      MemberRole: true,
    },
  });

  if (!isMember) {
    throw new Error("You are not a member of this group");
  }

  if (isMember.MemberRole.title != "ADMIN") {
    throw new Error("You are not an admin of this group");
  }

  const deletedGroup = await prisma.group.update({
    where: {
      id: id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return deletedGroup;
};

export { createGroup, getGroupDetail, getGroups, editGroup, deleteGroup };
