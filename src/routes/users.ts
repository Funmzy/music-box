import express from "express";
import passwordResetRouter from "./passwordResetRoutes";
import { loginUser, registerUser } from "../controllers/userAuth";
import verifyToken from "../middleware/auth";
import { changePassword } from "../controllers/users";
import { updateProfile } from "../controllers/updateProfile";
import { viewProfile } from "../controllers/viewProfile";

const router = express.Router();

// route for users
router.get("/", (req, res) => {
  res.send("users route");
});

router.use("/", passwordResetRouter);

// controller route to change user password
router.put("/change-password/:id", verifyToken, changePassword);
router.get("/profile/:id", verifyToken, viewProfile);
router.put("/profile/:id", verifyToken, updateProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
