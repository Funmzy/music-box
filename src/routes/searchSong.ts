import express from "express";
import { searchQuery, searchPlaylist } from "../controllers/search";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, searchQuery);
router.get("/:id", verifyToken, searchPlaylist);

export default router;
