import { Router } from "express";
import {
  requestPasswordResetController,
  resetPasswordController,
} from "../controllers/passwordResetController";

const router = Router();

router.post("/requestPasswordReset", requestPasswordResetController);
router.put("/resetPassword", resetPasswordController);

export default router;
