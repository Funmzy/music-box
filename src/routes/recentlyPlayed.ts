import express from "express";
import {
  saveRecentlyPlayed,
  getRecentlySaved,
} from "../controllers/recentlyPlayed";
import verifyToken from "../middleware/auth";

const router = express.Router();

// route to save recently played, expecting a query params of directory and a params of id
// /api/v1/music-box-api/recently-played/{{id}}?directory=playlist
router.post("/", verifyToken, saveRecentlyPlayed);
router.get("/", verifyToken, getRecentlySaved);

export default router;
