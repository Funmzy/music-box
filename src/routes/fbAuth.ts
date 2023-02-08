import express, { Request, Response } from "express";
import passport from "passport";
import { fbAuthController } from "../controllers/passport";

const router = express.Router();

router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

router.get(
  "/facebook/success",
  passport.authenticate("facebook", {
    successRedirect: "/api/v1/music-box-api/fb/profile",
    failureRedirect: "/api/v1/music-box-api/fb/fail",
  })
);

router.get("/profile", fbAuthController);
router.get("/fail", (req: Request, res: Response) => {
  res.status(401).json({
    status: "failed",
    message: "you are not authorized ",
  });
});

export default router;
