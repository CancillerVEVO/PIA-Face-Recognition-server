import { PrismaClient } from "@prisma/client";
import { Event } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_ROLE = 2;
const checkUserIsAdmin = async (userId: number, groupId: number) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group || group.deletedAt != null) {
    throw new Error("Group not found");
  }
  const isAdmin = await prisma.member.findFirst({
    where: {
      groupId: groupId,
      userId: userId,
      roleId: ADMIN_ROLE,
    },
    include: {
      Group: true,
    },
  });

  if (!isAdmin) {
    throw new Error("You are not an admin of this group");
  }
  const adminId = isAdmin.id;
  return adminId;
};

const userInGroup = async (userId: number, groupId: number) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group || group.deletedAt != null) {
    throw new Error("Group not found");
  }
  const isMember = await prisma.member.findFirst({
    where: {
      groupId: groupId,
      userId: userId,
    },
  });

  if (!isMember) {
    throw new Error("You are not a member of this group");
  }

  const memberId = isMember.id;

  return memberId;
};

const createEvent = async (event: Event, userId: number) => {
  const isAdmin = await checkUserIsAdmin(userId, event.groupId);

  if (!isAdmin) {
    throw new Error("You are not an admin of this group");
  }

  const newEvent = await prisma.event.create({
    data: {
      title: event.title,
      description: event.description,
      groupId: event.groupId,
      createdBy: isAdmin,
      endDate: new Date(`${event.endDate}`),
    },
  });

  return newEvent;
};
const getEventDetail = async (eventId: number, userId: number) => {
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
  await userInGroup(userId, event.groupId);

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

  const cleanEvent = {
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    attendance: createAttendanceList(cleanMembers, cleanAttendance),
  };

  return {
    event: cleanEvent,
  };
};
const getEvents = async (userId: number, groupId: number) => {
  const events = await prisma.event.findMany({
    where: {
      groupId: groupId,
    },
    include: {
      Group: true,
    },
  });

  if (!events) {
    throw new Error("Event not found");
  }

  await userInGroup(userId, groupId);

  const cleanEvents = events.map((event) => {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
    };
  });

  return cleanEvents;
};
const editEvent = async (event: Event, eventId: number, userId: number) => {
  const isAdmin = await checkUserIsAdmin(userId, event.groupId);

  if (!isAdmin) {
    throw new Error("You are not an admin of this group");
  }

  const updatedEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      title: event.title,
      description: event.description,
      endDate: new Date(`${event.endDate}`),
    },
  });

  return updatedEvent;
};
const deleteEvent = async (eventId: number, userId: number) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      Group: true,
    },
  });

  if (!event) {
    throw new Error("No event found");
  }

  const isAdmin = await checkUserIsAdmin(userId, event.groupId);

  if (!isAdmin) {
    throw new Error("You are not an admin of this group");
  }

  const deletedEvent = await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  return {
    message: "Event deleted successfully",
  };
};

export { createEvent, getEventDetail, getEvents, editEvent, deleteEvent };
