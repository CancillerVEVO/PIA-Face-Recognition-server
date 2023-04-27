import { PrismaClient } from "@prisma/client";
import {
  uploadImage,
  deleteImage,
  checkImageExists,
} from "../utils/firebase.handler";
import { recognize } from "../utils/recognition.handler";

const prisma = new PrismaClient();

const saveFaceData = async (file: any, id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (user?.imageUrl) {
    const exists = await checkImageExists(user.imageUrl);

    if (exists) {
      await deleteImage(user.imageUrl);
    }
  }

  const url = await uploadImage(file, "users");

  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      imageUrl: url,
    },
  });

  return updatedUser;
};

const deleteFaceData = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (typeof user?.imageUrl != "string") {
    throw new Error("User image not found");
  }

  if (typeof user?.imageUrl == "string") {
    const exists = await checkImageExists(user.imageUrl);
    if (exists) {
      await deleteImage(user.imageUrl);
    } else {
      throw new Error("User image not found");
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      imageUrl: null,
    },
  });

  return updatedUser;
};

const recognizeFace = async (file: any, id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (typeof user?.imageUrl != "string") {
    throw new Error("User image not found");
  }

  if (typeof user?.imageUrl == "string") {
    const exists = await checkImageExists(user.imageUrl);

    if (!exists) {
      throw new Error("User image not found");
    }
  }

  const url = await uploadImage(file, "tmp");

  const response = await recognize({
    known: [
      {
        image_url: user?.imageUrl,
        label: user?.username,
      },
    ],
    unknown: url,
  });

  return response;
};
export { saveFaceData, deleteFaceData, recognizeFace };
