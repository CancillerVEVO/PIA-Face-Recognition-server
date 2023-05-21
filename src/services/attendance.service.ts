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

  const today = new Date();

  if (event.endDate) {
    if (event.endDate < today) {
      throw new Error("Event has ended");
    }
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

  const attendance = await prisma.attendance.create({
    data: {
      memberId: member.id,
      eventId: eventId,
    },
    include: {
      Member: {
        include: {
          User: true,
        },
      },
    },
  });

  const cleanAttendance = {
    id: attendance.Member.id,
    username: attendance.Member.User.username,
    email: attendance.Member.User.email,
    imageUrl: attendance.Member.User.imageUrl,
    attendedDate: attendance.attendedDate,
  };

  return { attendance: cleanAttendance };
};

const listAttendance = async (eventId: number, userId: number) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },

    include: {
      Group: true,
      Attendance: {
        include: {
          Member: {
            include: { User: true },
          },
        },
      },
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

  const getAllMembers = await prisma.member.findMany({
    where: {
      groupId: event.groupId,
    },
    include: {
      User: true,
    },
  });

  const createAttendanceList = (members: any, attendance: any) => {
    const attendanceList = members.map((member: any) => {
      const memberAttendance = attendance.find(
        (attend: any) => attend.id === member.id
      );
      if (memberAttendance) {
        return {
          id: member.id,
          username: member.username,
          email: member.email,
          imageUrl: member.imageUrl,
          attendedDate: memberAttendance.attendedDate,
        };
      } else {
        return {
          id: member.id,
          username: member.username,
          email: member.email,
          imageUrl: member.imageUrl,
          attendedDate: null,
        };
      }
    });
    return attendanceList;
  };

  const cleanMembers = getAllMembers.map((member) => {
    return {
      id: member.id,
      username: member.User.username,
      email: member.User.email,
      imageUrl: member.User.imageUrl,
    };
  });
  const cleanAttendance = event.Attendance.map((attendance) => {
    return {
      id: attendance.memberId,
      username: attendance.Member.User.username,
      email: attendance.Member.User.email,
      imageUrl: attendance.Member.User.imageUrl,
      attendedDate: attendance.attendedDate,
    };
  });

  const attendanceList = createAttendanceList(cleanMembers, cleanAttendance);

  return { attendance: attendanceList };
};

export { registerAttendance, listAttendance };
