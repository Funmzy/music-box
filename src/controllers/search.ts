import { Request, Response } from "express";
import { fetchAllQuery } from "../services/genres";
import ResponseStatus from "../utils/response";
import Playlist from "../models/playlistModel";
import { IPlaylist } from "../types/types";

const responseStatus = new ResponseStatus();
export const searchPlaylist = async function (
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const playlistId = req.params.id;
    const songTitle = req.query.name as string;

    const playlist = await Playlist.findById({ _id: playlistId });
    if (!playlist) {
      responseStatus.setError(404, "playlist not found");
      return responseStatus.send(res);
    }
    const track = playlist.tracks;
    if (track) {
      const data = track.filter(
        (song) =>
          song.title.toLowerCase().indexOf(songTitle?.toLocaleLowerCase()) >= 0
        //   return song;
      );
      if (data.length === 0) {
        responseStatus.setError(404, "No song Found");
        return responseStatus.send(res);
      }
      responseStatus.setSuccess(200, "successful", data);
      return responseStatus.send(res);
    }
    responseStatus.setError(404, "empty track list");
    return responseStatus.send(res);
  } catch (error: any) {
    responseStatus.setError(500, error.message);
    return responseStatus.send(res);
  }
};

// search album playlist artist
export const searchQuery = async function (
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const queryString = req.query.name as string;
    if (queryString) {
      const playlistSearch = await searchPublicPlaylists(queryString);
      const allSearch = await fetchAllQuery(queryString as string);
      const [album, artist] = allSearch;
      const data = [{ album, artist, playlist: playlistSearch }];
      if (data.length === 0) {
        responseStatus.setError(404, "search not found");
        return responseStatus.send(res);
      }
      responseStatus.setSuccess(200, "successfull", data);
      return responseStatus.send(res);
    }
    responseStatus.setError(400, "type the search word ");
    return responseStatus.send(res);
  } catch (error: any) {
    responseStatus.setError(500, error.message);
    return responseStatus.send(res);
  }
};
// search user playlist
export const searchPublicPlaylists = async (
  search: string
): Promise<Record<string, any>[]> => {
  try {
    const publicPlaylists = await Playlist.find({ isPublic: true });
    if (publicPlaylists) {
      const data = publicPlaylists.filter(
        (playlist: IPlaylist) =>
          playlist.name.toLowerCase().indexOf(search?.toLocaleLowerCase()) >= 0
      );
      return data;
    }
    throw new Error("playlist not found");
  } catch (error: any) {
    throw new Error(error.message);
  }
};
