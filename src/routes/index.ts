import express, { Request, Response } from "express";
import playlistRoute from "./playlist";
import usersRoute from "./users";
import genreRoutes from "./genre";
import albumRoute from "./album";
import authRouter from "./googleAuth";
import fbRouter from "./fbAuth";
import searchRoutes from "./searchSong";
import historyRoute from "./history";
import recentlyPlayedRoutes from "./recentlyPlayed";
import artistRoute from "./artist";

const router = express.Router();

// controllers for playlist route
router.use("/playlist", playlistRoute);

// controllers for album route
router.use("/album", albumRoute);

// controllers for artist route
router.use("/artist", artistRoute);

router.get("/", (_req: Request, res: Response) => {
  res.send("music-box server is live");
});

// controller for search router
router.use("/search", searchRoutes);

// controllers for users route
router.use("/users", usersRoute);

// controller for genre route
router.use("/genres", genreRoutes);

// controller for album
router.use("/album", albumRoute);

// google authentication route
// http://localhost:3000/api/v1/music-box-api/auth/google
router.use("/auth", authRouter);

// facebook authentication route
// http://localhost:3000/api/v1/music-box-api/fb/facebook
router.use("/fb", fbRouter);

// controller for user route
router.use("/users", usersRoute);

// listening history route
router.use("/history", historyRoute);

// controller for recently played music
router.use("/recently-played", recentlyPlayedRoutes);

export default router;
