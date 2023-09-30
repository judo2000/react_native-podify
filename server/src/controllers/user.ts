import { RequestHandler } from "express";
import nodemailer from "nodemailer";

import User from "#/models/user";
import emailVerificationToken from "#/models/emailVerificationToken";
import { CreateUser } from "#/@types/user";
import { MAILTRAP_USER, MAILTRAP_PASS } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  const token = generateToken();
  await emailVerificationToken.create({
    owner: user._id,
    token,
  });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  transport.sendMail({
    to: user.email,
    from: "auth@myapp.com",
    html: `<h1>Your verification token is: ${token}</h1>,`,
  });
  res.status(201).json({ user });
};
