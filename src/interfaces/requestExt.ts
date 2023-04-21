import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

interface RequestExt extends Request {
  user?: JwtPayload | { id: string };
}

export { RequestExt };
