import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

import User from "#/models/user";
import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import { sendVerificationMail } from "#/utils/mail";
import { generateToken } from "#/utils/helper";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "#/utils/variables";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  // send verification email
  const token = generateToken();
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const matched = await verificationToken.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified!" });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request!" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid request!" });

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check your email!" });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "Account not found!" });

  // generate reset password link

  // create token using crypto
  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&id=${user._id}`;

  res.json({ resetLink });
};
