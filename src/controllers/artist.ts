/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable eqeqeq */
// eslint-disable-next-line consistent-return
// eslint-disable-next-line no-console

import { Request, Response } from "express";
import ResponseClass from "../utils/response";
import { ArtistModel } from "../models/artistModel";
import axios from "axios";
import { ObjectId } from "mongoose";

const response = new ResponseClass();

export const getLikedArtistsByUser = async (req: Request, res: Response) => {
  try {
    const { id: currentUser } = req.user as Record<string, any>;
    const artists = await ArtistModel.find({ likedBy: { $in: [currentUser] } })
      .lean()
      .exec();

    if (artists) {
      if (artists.length) {
        response.setSuccess(201, "Successfully!", { payload: artists });
        return response.send(res);
      }
      response.setError(404, "User liked no artist");
      return response.send(res);
    }

    response.setError(404, "No public artist");
    return response.send(res);
  } catch (err: any) {
    console.error(err.message);
    response.setError(400, "Error occured during query");
    return response.send(res);
  }
};

export const mostPlayedArtist = async (req: Request, res: Response) => {
  try {
    const { id: currentUser } = req.user as Record<string, any>;

    if (!currentUser) {
      response.setError(400, "Unauthorized access");
      return response.send(res);
    }

    const mostPlayed = await ArtistModel.find({})
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

export const addArtistById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const result = await ArtistModel.findOne({ id: +id });
    if (result === null) {
      const getArtist = await axios.get(`https://api.deezer.com/artist/${id}`);
      const addArtist = await ArtistModel.create(getArtist.data);
      response.setSuccess(201, "successful", addArtist);
      return response.send(res);
    }
    const getArtist = await axios.get(`https://api.deezer.com/artist/${id}`);
    response.setError(
      409,
      `Artist with the id of ${getArtist.data.id} is already in the database`
    );
    return response.send(res);
  } catch (error) {
    response.setError(400, "Artist does not exist");
    return response.send(res);
  }
};

export const likeArtist = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { _id } = req.user;

    // find artist in database
    const artistProfile = await ArtistModel.findOne({ id: +id });

    // if artist is not found in db, search deezer
    if (!artistProfile) {
      const deezerArtistProfile = await axios.get(
        `https://api.deezer.com/artist/${id}`
      );

      if (!deezerArtistProfile) {
        response.setError(400, "Artist does not exist");
        return response.send(res);
      }

      const {
        name,
        share,
        picture,
        picture_small,
        picture_medium,
        picture_big,
        picture_xl,
        nb_album,
        nb_fan,
        radio,
        tracklist,
        type,
      } = deezerArtistProfile.data;

      const newArtistProfile = await ArtistModel.create({
        id,
        name,
        share,
        picture,
        picture_small,
        picture_medium,
        picture_big,
        picture_xl,
        nb_album,
        nb_fan,
        radio,
        tracklist,
        type,
        likedBy: [_id],
        likedCount: 1,
      });

      response.setSuccess(201, "successful", newArtistProfile);
      return response.send(res);
    }

    if (artistProfile && artistProfile.likedBy.includes(_id)) {
      const updateArtistProfile = await ArtistModel.findOneAndUpdate(
        { id: +id },
        {
          $pull: { likedBy: _id as string },
          $inc: { likedCount: -1 },
        },
        { new: true }
      ).exec();

      response.setSuccess(201, "successful", updateArtistProfile);
      return response.send(res);
    }
    const updateArtistProfile = await ArtistModel.findOneAndUpdate(
      { id: +id },
      {
        $push: { likedBy: _id as string },
        $inc: { likedCount: 1 },
      },
      { new: true }
    ).exec();
    response.setSuccess(201, "successful", updateArtistProfile);
    return response.send(res);
  } catch (err) {
    response.setError(400, "Artist does not exist");
    return response.send(res);
  }
};

export const listeningCount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateListeningCount = await ArtistModel.findOneAndUpdate(
      { _id: id },
      { $inc: { listeningCount: 1 } },
      { new: true }
    ).exec();
    response.setSuccess(201, "successful", updateListeningCount);
    return response.send(res);
  } catch (err) {
    response.setError(400, "Artist does not exist");
    return response.send(res);
  }
};

export const getArtistDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  // get artist details
  try {
    // find artist from db, if artist is found, send it as response
    const dbArtist = await ArtistModel.findOne({ id: +id });

    if (dbArtist) {
      const songs = await axios.get(`https://api.deezer.com/artist/${id}/top`);
      const albums = await axios.get(
        `https://api.deezer.com/artist/${id}/albums`
      );

      const artistDetail = {
        artist: dbArtist,
        songs: songs.data.data,
        albums: albums.data.data,
      };

      response.setSuccess(200, "Successful", artistDetail);
      return response.send(res);
    }

    // if artist is not found, search artist on deezer, save to database and send response

    const artist = await axios.get(`https://api.deezer.com/artist/${id}`);
    if (!artist.data.error) {
      const {
        id: deezerId,
        name,
        share,
        picture,
        picture_small,
        picture_medium,
        picture_big,
        picture_xl,
        nb_album,
        nb_fan,
        radio,
        tracklist,
        type,
      } = artist.data;

      const deezerArtist = await ArtistModel.create({
        id: deezerId,
        name,
        share,
        picture,
        picture_small,
        picture_medium,
        picture_xl,
        picture_big,
        nb_album,
        nb_fan,
        radio,
        tracklist,
        type,
        likedBy: [],
      });

      const songs = await axios.get(`https://api.deezer.com/artist/${id}/top`);
      const albums = await axios.get(
        `https://api.deezer.com/artist/${id}/albums`
      );

      const allArtistDetail = {
        artist: deezerArtist,
        songs: songs.data.data,
        albums: albums.data.data,
      };
      response.setSuccess(200, "Successful", allArtistDetail);
      return response.send(res);
    }
    response.setError(404, "Artist not found");
    return response.send(res);
  } catch (err) {
    response.setError(400, "an error occurred");
    return response.send(res);
  }
};

// artist track list
