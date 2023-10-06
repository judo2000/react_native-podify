import { updateHistory } from "#/controllers/history";
import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { UpdateHistoryValidationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  mustAuth,
  validate(UpdateHistoryValidationSchema),
  updateHistory
);

export default router;