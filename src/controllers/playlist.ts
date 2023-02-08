/* eslint-disable consistent-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response } from "express";
import Playlist from "../models/playlistModel";
import ResponseClass from "../utils/response";
import { IPlaylist, ITrack } from "../types/types";

const response = new ResponseClass();

export const getPublicPlaylists = async (req: Request, res: Response) => {
  try {
    const { id: currentUser } = req.user as Record<string, any>;

    if (!currentUser) {
      response.setError(401, "Unauthorized access");
      return response.send(res);
    }

    const publicPlaylists = await Playlist.find({ isPublic: true })
      .lean()
      .exec();

    if (publicPlaylists) {
      response.setSuccess(200, "Successful!", { payload: publicPlaylists });
      return response.send(res);
    }

    response.setError(404, "No pulic playlist");
    return response.send(res);
  } catch (error) {
    response.setError(404, "Invalid request");
    return response.send(res);
  }
};

export const getPlaylistsCreatedByUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id: currentUser } = req.user as Record<string, any>;

    if (!currentUser) {
      response.setError(401, "Unauthorized access");
      return response.send(res);
    }

    const playlists = await Playlist.find({ ownerId: currentUser })
      .lean()
      .exec();

    if (playlists) {
      response.setSuccess(200, "Successful!", { payload: playlists });
      return response.send(res);
    }

    response.setError(404, "No playlist created by user");
    return response.send(res);
  } catch (error) {
    response.setError(404, "Invalid request");
    return response.send(res);
  }
};

export const getPlaylist = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const playlistId = req.params.id;
    const { id: currentUser } = req.user as Record<string, any>;
    const playlist = await Playlist.findById({ _id: playlistId }).lean().exec();

    if (playlist) {
      if (
        playlist.isPublic ||
        (currentUser && playlist.ownerId == currentUser)
      ) {
        response.setSuccess(200, "Successful!", { payload: playlist });
        return response.send(res);
      }
      response.setError(401, "Private playlist");
      return response.send(res);
    }

    response.setError(404, "Playlist not found");
    return response.send(res);
  } catch (error) {
    response.setError(400, "Invalid request");
    return response.send(res);
  }
};

export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const playlist: IPlaylist = req.body;
    const { id: currentUser } = req.user as Record<string, any>;
    playlist.ownerId = currentUser;
    const newPlaylist = await Playlist.create(playlist);

    if (newPlaylist) {
      response.setSuccess(201, "Successful!", {
        payload: newPlaylist.toJSON(),
      });
      return response.send(res);
    }

    response.setError(400, "Invalid input data");
    return response.send(res);
  } catch (error: any) {
    if (error.message.split(" ").includes("duplicate")) {
      response.setError(400, `${error.keyValue.name} already exists`);
      return response.send(res);
    }
    response.setError(400, "Error creating playlist");
    return response.send(res);
  }
};

export const addToPlaylist = async (req: Request, res: Response) => {
  try {
    const { id: playlistId } = req.params;
    const {
      id: trackId,
      duration,
      artist,
      album,
      preview,
      title,
      albumImgUrl,
    } = req.body as ITrack;

    if (!duration || !artist || !album || !preview || !title || !albumImgUrl) {
      response.setError(400, "incomplete track input");
      return response.send(res);
    }
    const { id: currentUser } = req.user as Record<string, any>;
    const playlist = await Playlist.findOne({
      _id: playlistId,
      ownerId: currentUser,
    }).exec();

    if (playlist && playlist.tracks) {
      const duplicate = playlist.tracks.find((track) => track.id === trackId);
      if (duplicate) {
        response.setError(400, "Track already exists");
        return response.send(res);
      }

      playlist.tracks.push(req.body);
      const saved = await playlist.save();

      if (saved) {
        response.setSuccess(201, "Successful!", { payload: saved });
        return response.send(res);
      }
    }

    response.setError(400, "User can't carry out operation");
    return response.send(res);
  } catch (error) {
    console.log(error);
    response.setError(400, "Error adding song to playlist");
    return response.send(res);
  }
};

export const removeFromPlaylist = async (req: Request, res: Response) => {
  try {
    const { id: playlistId } = req.params;
    const { id: trackId } = req.body as Record<string, any>;
    const { id: currentUser } = req.user as Record<string, any>;
    const playlist = await Playlist.findById({
      _id: playlistId,
      ownerId: currentUser,
    }).exec();

    if (playlist && playlist.tracks) {
      const index = playlist.tracks.findIndex((track) => track.id === trackId);
      if (index === -1) {
        response.setError(404, "Track not found");
        return response.send(res);
      }

      playlist.tracks.splice(index, 1);
      const saved = await playlist.save();

      if (saved) {
        response.setSuccess(201, "Successfully removed!", { payload: saved });
        return response.send(res);
      }
    }

    response.setError(400, "User can't carry out operation");
    return response.send(res);
  } catch (error) {
    console.error(error);
    response.setError(400, "Error removing song from playlist");
    return response.send(res);
  }
};

export const removePlaylist = async (req: Request, res: Response) => {
  try {
    const { id: playlistId } = req.params;
    const { id: currentUser } = req.user as Record<string, any>;
    const deleted = await Playlist.findOneAndRemove({
      _id: playlistId,
      ownerId: currentUser,
    }).exec();

    if (deleted) {
      response.setSuccess(201, "Successfully removed!", { payload: {} });
      return response.send(res);
    }

    response.setError(400, "User can't carry out operation");
    return response.send(res);
  } catch (error) {
    response.setError(400, "Error removing playlist");
    return response.send(res);
  }
};

export const likePublicPost = async (
  req: Request | any,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.user as Record<string, any>;
    const toLike = await Playlist.findOne({
      _id: req.params.id,
      isPublic: true,
      likes: { $in: [id] },
    }).exec();
    if (!toLike) {
      const addedLike = await Playlist.findOneAndUpdate(
        { _id: req.params.id, isPublic: true },
        { $push: { likes: id }, $inc: { likesCount: 1 } },
        { new: true }
      ).exec();
      if (addedLike) {
        const newData = {
          data: addedLike,
        };
        response.setSuccess(200, "Successful", newData);
        return response.send(res);
      }

      response.setError(400, "failed");
      return response.send(res);
    }
    // response.setError(400, "you can not like a playlist more than once");
    // return response.send(res);

    const removedLike = await Playlist.findOneAndUpdate(
      { _id: req.params.id, isPublic: true },
      { $pull: { likes: id }, $inc: { likesCount: -1 } },
      { new: true }
    ).exec();

    // removedLike.likeCount = removedLike.likes.length;
    // await removedLike.save();

    const newData = {
      data: removedLike,
    };

    response.setSuccess(200, "Successful", newData);
    return response.send(res);
  } catch (err) {
    response.setError(400, "failed");
    return response.send(res);
  }
};

export const mostPlayedPlaylist = async (req: Request, res: Response) => {
  try {
    const { id: currentUser } = req.user as Record<string, any>;
    if (!currentUser) {
      response.setError(400, "Unauthorized access");
      return response.send(res);
    }
    const mostPlayed = await Playlist.find({ isPublic: true })
      .sort({ listeningCount: -1 })
      .lean()
      .exec();
    response.setSuccess(200, "Successful", { payload: mostPlayed });
    return response.send(res);
  } catch (err: any) {
    console.error(err.message);
    response.setError(400, "Error occured during query");
    return response.send(res);
  }
};

export const mostLikedPlaylist = async (req: Request, res: Response) => {
  try {
    const { id: currentUser } = req.user as Record<string, any>;
    if (!currentUser) {
      response.setError(400, "Unauthorized access");
      return response.send(res);
    }
    const mostLiked = await Playlist.find({ isPublic: true })
      .sort({ likesCount: -1 })
      .lean()
      .limit(10)
      .exec();
    response.setSuccess(200, "Successful", { payload: mostLiked });
    return response.send(res);
  } catch (err: any) {
    console.error(err.message);
    response.setError(400, "Error occured during query");
    return response.send(res);
  }
};

export const getLikedPlaylistsByUser = async (req: Request, res: Response) => {
  try {
    const { id: currentUser } = req.user as Record<string, any>;
    const playlists = await Playlist.find({
      isPublic: true,
      likes: { $in: [currentUser] },
    })
      .lean()
      .exec();

    if (playlists) {
      if (playlists.length) {
        response.setSuccess(201, "Successfully!", { payload: playlists });
        return response.send(res);
      }

      response.setError(404, "User liked no playlist");
      return response.send(res);
    }

    response.setError(404, "No public playlist");
    return response.send(res);
  } catch (err: any) {
    console.error(err.message);
    response.setError(400, "Error occured during query");
    return response.send(res);
  }
};
