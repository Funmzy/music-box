import { Request, Response } from "express";
import ResponseStatus from "../response";
import { RecentlyPlayedModel } from "../../models/recentlyPlayedModel";
import PlaylistModel from "../../models/playlistModel";
import { AlbumModel } from "../../models/albumModel";
import { ArtistModel } from "../../models/artistModel";

const responseStatus = new ResponseStatus();
export default {
  playlist: async (req: Request, res: Response): Promise<Response> => {
    try {
      const playlistInDb = await PlaylistModel.findById(req.body.id);
      if (!playlistInDb) {
        responseStatus.setError(404, "Playlist Not Found");
        return responseStatus.send(res);
      }
      const alreadyExist = await RecentlyPlayedModel.findOne({
        directory_info: req.body.id,
        directory_type: req.body.directory,
        player_id: req.user.id,
      });
      if (alreadyExist) {
        const existData = await RecentlyPlayedModel.findByIdAndUpdate(
          alreadyExist._id,
          { $set: { updatedAt: Date.now() } }
        );
        responseStatus.setSuccess(201, "added to recently played", existData);
        return responseStatus.send(res);
      }
      // save to database
      const playlist = new RecentlyPlayedModel({
        player_id: req.user.id,
        directory_info: req.body.id,
        onModel: "Playlist",
        directory_type: req.body.directory,
      });
      const playData = await playlist.save();
      responseStatus.setSuccess(201, "added to recently played", playData);
      return responseStatus.send(res);
    } catch (error) {
      responseStatus.setError(500, "internal server error");
      return responseStatus.send(res);
    }
  },
  album: async (req: Request, res: Response): Promise<Response> => {
    try {
      await AlbumModel.findById(req.body.id);
      const alreadyExist = await RecentlyPlayedModel.findOne({
        directory_info: req.body.id,
        directory_type: req.body.directory,
        player_id: req.user.id,
      });
      if (alreadyExist) {
        const existData = await RecentlyPlayedModel.findByIdAndUpdate(
          alreadyExist._id,
          { $set: { updatedAt: Date.now() } }
        );
        responseStatus.setSuccess(201, "added to recently played", existData);
        return responseStatus.send(res);
      }
      // save to database
      const album = new RecentlyPlayedModel({
        player_id: req.user.id,
        directory_info: req.body.id,
        onModel: "Album",
        directory_type: req.body.directory,
      });
      const albumData = await album.save();
      responseStatus.setSuccess(201, "added to recently played", albumData);
      return responseStatus.send(res);
    } catch (error) {
      responseStatus.setError(500, "internal server error");
      return responseStatus.send(res);
    }
  },
  artist: async (req: Request, res: Response): Promise<Response> => {
    try {
      await ArtistModel.findById(req.body.id);
      const alreadyExist = await RecentlyPlayedModel.findOne({
        directory_info: req.body.id,
        directory_type: req.body.directory,
        player_id: req.user.id,
      });
      if (alreadyExist) {
        const existData = await RecentlyPlayedModel.findByIdAndUpdate(
          alreadyExist._id,
          { $set: { updatedAt: Date.now() } }
        );
        responseStatus.setSuccess(201, "added to recently played", existData);
        return responseStatus.send(res);
      }
      // save to database
      const artist = new RecentlyPlayedModel({
        player_id: req.user.id,
        directory_info: req.body.id,
        onModel: "Artist",
        directory_type: req.body.directory,
      });
      const artistData = await artist.save();
      responseStatus.setSuccess(201, "added to recently played", artistData);
      return responseStatus.send(res);
    } catch (error) {
      responseStatus.setError(500, "internal server error");
      return responseStatus.send(res);
    }
  },
};
