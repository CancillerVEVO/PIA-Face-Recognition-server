import { hash, compare } from "bcrypt";

const saltRounds = process.env.SALT_ROUNDS || 10;

const encrypt = async (password: string): Promise<string> => {
  const salt = await hash(password, Number(saltRounds));
  return salt;
};

const verify = async (password: string, hash: string): Promise<boolean> => {
  const isMatch = await compare(password, hash);
  return isMatch;
};

export { encrypt, verify };
