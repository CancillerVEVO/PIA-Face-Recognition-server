import { Prisma, PrismaClient } from "@prisma/client";
import { encrypt, verify } from "../utils/bcrypt.handler";
import { User } from "@prisma/client";

const prisma = new PrismaClient();

const register = async ({ username, email, password }: User) => {
  try {
    console.log(username, email, password);

    const checkEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const checkUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (checkEmail) {
      throw new Error("Email already exists");
    }

    if (checkUsername) {
      throw new Error("Usernamme alredy exists");
    }

    const hash = await encrypt(password);

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hash,
      },
    });

    return user;
  } catch (e) {
    console.log(e);
  }
};

export { register };
