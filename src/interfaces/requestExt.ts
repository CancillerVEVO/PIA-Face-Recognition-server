import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

interface RequestExt extends Request {
  user?:
    | JwtPayload
    | { id: string; username: string; email: string; imageUrl: string | null };
}

export { RequestExt };
