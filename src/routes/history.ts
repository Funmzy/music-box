import { Router } from "express";
import {
  addSongToHistory,
  getListeningHistory,
  removeSongFromHistory,
} from "../controllers/history";
import verifyToken from "../middleware/auth";

const router = Router();
// Get a user's listening history
router.get("/getHistory", verifyToken, getListeningHistory);

// Add song to or update user's listening history
router.put("/updateHistory/:id", verifyToken, addSongToHistory);

// Remove a song from listening history
router.delete("/removeHistory/:id", verifyToken, removeSongFromHistory);

export default router;
