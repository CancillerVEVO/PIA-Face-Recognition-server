import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.handler";
import { RequestExt } from "../interfaces/requestExt";

const checkJWT = async (req: RequestExt, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const payload = verifyToken(token);

    req.user = payload;
    next();
  } catch (e) {
    console.log(e);
    res.status(400);
    res.send("INVALID_SESSION");
  }
};

export { checkJWT };
