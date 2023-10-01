import { RequestHandler } from "express";

import User from "#/models/user";
import { CreateUser } from "#/@types/user";
import { MAILTRAP_USER, MAILTRAP_PASS } from "#/utils/variables";
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
  transport.sendMail({
    to: user.email,
    from: "auth@myapp.com",
    html: "<h1>Podify Verification</h1>",
  });
  res.status(201).json({ user });
};
