import { Request, Response } from "express";
import ResponseStatus from "../utils/response";
import { RecentlyPlayedModel } from "../models/recentlyPlayedModel";
import helpers from "../utils/recentlyPlayedHelper/recentlyPlayedHelper";
import { RECENTLY_PLAYED } from "../types/types";

const responseStatus = new ResponseStatus();

export async function saveRecentlyPlayed(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const directories: string[] = ["playlist", "artiste", "album"];

    // check if directory provided match any value in the directories array
    if (!directories.includes(req.body.directory.toLocaleLowerCase())) {
      responseStatus.setError(400, "Please provide a valid directory");
    }

    // check if id of directory is provided in the body
    if (!req.body.id) {
      responseStatus.setError(400, "Please provide an id");
      return responseStatus.send(res);
    }

    // if directory is equal to playlist
    if (req.body.directory.toLocaleLowerCase() === "playlist") {
      return helpers.playlist(req, res);
    }

    // if directory is equal to album
    if (req.body.directory.toLocaleLowerCase() === "album") {
      return helpers.album(req, res);
    }

    // // if directory is equal to artiste
    if (req.body.directory.toLocaleLowerCase() === "artist") {
      return helpers.artist(req, res);
    }

    responseStatus.setError(500, "An unknown error occurred");
    return responseStatus.send(res);
  } catch (error) {
    responseStatus.setError(500, "An unknown error occurred");
    return responseStatus.send(res);
  }
}

export async function getRecentlySaved(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const data: RECENTLY_PLAYED[] = await RecentlyPlayedModel.find({
      player_id: req.user.id,
    })
      .populate({ path: "directory_info" })
      .sort({ updatedAt: -1 })
      .limit(20);
    const playlist = data.filter((play) => play.directory_type === "playlist");
    const artist = data.filter((play) => play.directory_type === "artist");
    const album = data.filter((play) => play.directory_type === "album");
    const result = {
      playlist,
      artist,
      album,
    };
    responseStatus.setSuccess(200, "successful", result);
    return responseStatus.send(res);
  } catch (error) {
    responseStatus.setError(500, "An unknown error occurred");
    return responseStatus.send(res);
  }
}
