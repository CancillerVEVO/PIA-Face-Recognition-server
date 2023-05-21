import { Request, Response } from "express";
import { register, login, me } from "../services";
import { RequestExt } from "../interfaces/requestExt";

const registerController = async ({ body }: Request, res: Response) => {
  try {
    const user = await register(body);

    res.status(200);
    res.send(user);
  } catch (e) {
    console.log(e);

    res.status(403);
    e instanceof Error
      ? res.json({ message: e.message })
      : res.json({ mesage: e });
  }
};
const loginController = async ({ body }: Request, res: Response) => {
  try {
    const user = await login(body);

    res.status(200);
    res.json(user);
  } catch (e) {
    console.log(e);

    res.status(403);
    e instanceof Error
      ? res.json({ message: e.message })
      : res.json({ message: e });
  }
};
const meController = async ({ user }: RequestExt, res: Response) => {
  try {
    const meUser = await me(user?.id);

    res.status(200);
    res.json(meUser);
  } catch (error) {
    res.status(403);
    error instanceof Error
      ? res.json({ message: error.message })
      : res.json({ message: error });
  }
};

export { registerController, loginController, meController };
