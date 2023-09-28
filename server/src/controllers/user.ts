import { RequestHandler } from "express";

import User from "#/models/user";
import { CreateUser } from "#/@types/user";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });
  res.status(201).json({ user });
};
