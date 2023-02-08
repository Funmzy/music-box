import express from "express";
import {
  getPlaylist,
  createPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  getPublicPlaylists,
  removePlaylist,
  likePublicPost,
  getLikedPlaylistsByUser,
  mostPlayedPlaylist,
  getPlaylistsCreatedByUser,
  mostLikedPlaylist,
} from "../controllers/playlist";

import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/mostPlayed", verifyToken, mostPlayedPlaylist);
router.get("/mostLiked", verifyToken, mostLikedPlaylist);
router.get("/created", verifyToken, getPlaylistsCreatedByUser);
router.get("/likes", verifyToken, getLikedPlaylistsByUser);
router.put("/likes/:id", verifyToken, likePublicPost);
router.delete("/delete/:id", verifyToken, removePlaylist);

router
  .route("/")
  .get(verifyToken, getPublicPlaylists)
  .post(verifyToken, createPlaylist);

router
  .route("/:id")
  .get(verifyToken, getPlaylist)
  .put(verifyToken, addToPlaylist)
  .delete(verifyToken, removeFromPlaylist);

export default router;
