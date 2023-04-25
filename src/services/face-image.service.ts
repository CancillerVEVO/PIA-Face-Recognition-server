import { PrismaClient } from "@prisma/client";
import {
  uploadImage,
  deleteImage,
  checkImageExists,
} from "../utils/firebase.handler";

const prisma = new PrismaClient();

const saveFaceData = async (file: any, id: string) => {
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
export { saveFaceData };
