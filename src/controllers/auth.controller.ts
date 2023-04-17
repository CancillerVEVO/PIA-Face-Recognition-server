import { Request, Response } from "express";
import { register } from "../services";

const registerController = async ({ body }: Request, res: Response) => {
  try {
    const user = await register(body);

    if (!user) {
      throw new Error("ERROR_REGISTERING_USER");
    }
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
    res.status(200);
    res.send("Login");
  } catch (e) {
    console.log(e);
  }
};

export { registerController, loginController };
