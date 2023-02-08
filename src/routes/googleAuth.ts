import express, { Request, Response } from "express";
import passport from "passport";
import { googleAuthController } from "../controllers/passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/success",
  passport.authenticate("google", {
    successRedirect: "/api/v1/music-box-api/auth/profile",
    failureRedirect: "/api/v1/music-box-api/auth/fail",
  })
);

router.get("/profile", googleAuthController);
router.get("/fail", (req: Request, res: Response) => {
  res.status(401).json({
    status: "failed",
    message: "you are not authorized ",
  });
});

export default router;
