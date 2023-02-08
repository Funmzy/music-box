import express from "express";
import {
  getOneGenre,
  getGenres,
  getArtistsByGenre,
  getPlaylistByGenre,
} from "../controllers/genre";

const router = express.Router();

// route to get all genres
router.get("/", getGenres);
// route to get a genre by the deezer id
router.get("/:id", getOneGenre);

// get playlist associated to a particular genre
router.get("/playlist/:id", getPlaylistByGenre);

// get playlist associated to a particular genre
router.get("/artist/:id", getArtistsByGenre);

export default router;
