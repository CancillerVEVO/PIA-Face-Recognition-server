import { Request, Response } from "express";
import { register, login } from "../services";

const registerController = async ({ body }: Request, res: Response) => {
  try {
    const user = await register(body);

    res.status(200);
    res.send(user);
  } catch (e) {
    res.status(403);

    res.send("ERROR_REGISTERING_USER");
    console.log(e);
  }
};
const loginController = async ({ body }: Request, res: Response) => {
  try {
    const user = await login(body);

    res.status(200);
    res.send(user);
  } catch (e) {
    res.status(403);
    res.send("ERROR_LOGGING_IN");
    console.log(e);
  }
};

export { registerController, loginController };
