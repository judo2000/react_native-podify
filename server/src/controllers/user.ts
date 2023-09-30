import { RequestHandler } from "express";

import User from "#/models/user";
import { CreateUser } from "#/@types/user";
import { generateToken } from "#/utils/helper";
import { sendVerificationEmail } from "#/utils/mail";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  // send verification email
  const token = generateToken();
  sendVerificationEmail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({
    user: {
      id: user._id,
      name,
      email,
    },
  });
};
