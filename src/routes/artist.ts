import express from "express";

import {
  mostPlayedArtist,
  getLikedArtistsByUser,
  addArtistById,
  likeArtist,
  listeningCount,
  getArtistDetails,
} from "../controllers/artist";

import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/likes", verifyToken, getLikedArtistsByUser);
router.get("/mostPlayed", verifyToken, mostPlayedArtist);

// route to post artist by id
router.post("/:id", verifyToken, addArtistById);

// get artist details by id
router.get("/:id", verifyToken, getArtistDetails);

// route to increase like count and add id of users that like
router.put("/like/:id", verifyToken, likeArtist);

// route to increase listening count
router.put("/listened/:id", verifyToken, listeningCount);

export default router;
