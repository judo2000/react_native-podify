import {
  create,
  generateForgetPasswordLink,
  grantValid,
  sendReVerificationToken,
  signIn,
  updatePassword,
  verifyEmail,
} from "#/controllers/user";
import User from "#/models/user";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  SignValidationSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import { JWT_SECRET } from "#/utils/variables";
import { Router } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidation),
  isValidPassResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);
router.post("/sign-in", validate(SignValidationSchema), signIn);
router.get("/is-auth", mustAuth, (req, res) => {
  res.json({
    profile: req.user,
  });
});

import formidable from "formidable";

router.post("/update-profile", (req, res) => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data;"))
    return res.status(422).json({ error: "Only accepts form-data" });

  // handle file upload
  const form = formidable();
  form.parse(req, (err, fields, files) => {
    console.log("Fields", fields);
    console.log("Files", files);

    res.json({ uploaded: true });
  });
});
export default router;
