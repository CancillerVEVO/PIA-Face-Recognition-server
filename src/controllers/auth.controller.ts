import { Request, Response } from "express";

const registerController = async ({ body }: Request, res: Response) => {
  try {
    res.send("Register");
  } catch (e) {
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
