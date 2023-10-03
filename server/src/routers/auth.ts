import {
  create,
  generateForgetPasswordLink,
  grantValid,
  sendReVerificationToken,
  signIn,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "#/controllers/user";
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
import fileParser, { RequestWithFiles } from "#/middleware/fileParser";

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

router.post("/update-profile", mustAuth, fileParser, updateProfile);

export default router;
