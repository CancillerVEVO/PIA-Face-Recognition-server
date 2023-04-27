import { Request, Response } from "express";
import { register, login } from "../services";

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
    res.send(user);
  } catch (e) {
    console.log(e);

    res.status(403);
    e instanceof Error
      ? res.json({ message: e.message })
      : res.json({ message: e });
  }
};

export { registerController, loginController };
