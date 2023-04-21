import { Prisma, PrismaClient } from "@prisma/client";
import { encrypt, verify } from "../utils/bcrypt.handler";
import { generateToken } from "../utils/jwt.handler";
import { User } from "@prisma/client";

const prisma = new PrismaClient();

const register = async ({ username, email, password }: User) => {
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

  if (checkUsername) {
    throw new Error("Usernamme alredy exists");
  }

  if (checkEmail) {
    throw new Error("Email already exists");
  }

  const hash = await encrypt(password);

  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hash,
    },
  });

  const cleanUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    imageUrl: user.imageUrl,
  };

  return cleanUser;
};

const login = async ({ email, password }: User) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await verify(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = generateToken({
    id: user.id,
  });

  return token;
};

export { register, login };
