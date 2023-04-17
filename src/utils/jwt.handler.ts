import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "AQUI EL SECRET";

const generateToken = (payload: any): string => {
  const token = sign(payload, JWT_SECRET);
  return token;
};

const verifyToken = (token: string): any => {
  const payload = verify(token, JWT_SECRET);
  return payload;
};

export { generateToken, verifyToken };
