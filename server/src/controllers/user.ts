import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import path from "path";

import User from "#/models/user";
import emailVerificationToken from "#/models/emailVerificationToken";
import { CreateUser } from "#/@types/user";
import { MAILTRAP_USER, MAILTRAP_PASS } from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import { generateTemplate } from "#/mail/template";
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

  const welcomeMessage = `Hi ${name}, welcome to Podify!  There are so many things we do for verified users.  Use the given OTP (One-Time-Password) to verify your email.`;

  transport.sendMail({
    to: user.email,
    from: "auth@myapp.com",
    subject: "Welcome to Podify",
    html: generateTemplate({
      title: "Welcome to Podify",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
  res.status(201).json({ user });
};
