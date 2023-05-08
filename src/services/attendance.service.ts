import { PrismaClient } from "@prisma/client";
import { recognizeFace } from "./face-image.service";

const prisma = new PrismaClient();

const checkAttendanceExists = async (eventId: number, memberId: number) => {
  const attendance = await prisma.attendance.findFirst({
    where: {
      eventId: eventId,
      memberId: memberId,
    },
  });

  if (attendance) {
    return true;
  }

  return false;
};
const registerAttendance = async (
  file: any,
  userId: number,
  eventId: number
) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      Group: true,
    },
  });
  if (!event) {
    throw new Error("Event not found");
  }

  const groupId = event.Group.id;

  const member = await prisma.member.findFirst({
    where: {
      userId: userId,
      groupId: groupId,
    },
  });

  if (!member) {
    throw new Error("You are not a member of this group");
  }

  const checkAttendance = await checkAttendanceExists(eventId, member.id);

  if (checkAttendance) {
    throw new Error("You have already registered your attendance");
  }

  const result = await recognizeFace(file, userId);

  if (result.status !== 200) {
    throw new Error(result.message);
  }

  const attendance = await prisma.attendance.create({
    data: {
      memberId: member.id,
      eventId: eventId,
    },
  });

  return attendance;
};

const listAttendance = async (eventId: number, userId: number) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      Group: true,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  const groupId = event.Group.id;

  const member = await prisma.member.findFirst({
    where: {
      userId: userId,
      groupId: groupId,
    },
  });

  if (!member) {
    throw new Error("You are not a member of this group");
  }

  const attendance = await prisma.attendance.findMany({
    where: {
      eventId: eventId,
    },
    include: {
      Member: {
        include: {
          User: true,
          MemberRole: true,
        },
      },
    },
  });

  const cleanAttendance = attendance.map((item) => {
    return {
      memberId: item.memberId,
      role: item.Member.MemberRole.title,
      username: item.Member.User.username,
      email: item.Member.User.email,
      attendanceDate: item.attendedDate,
    };
  });

  return cleanAttendance;
};

export { registerAttendance, listAttendance };
