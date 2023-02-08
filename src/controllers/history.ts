/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import { fetchTrack } from "../services/history.service";
import historyModel from "../models/historyModel";
import { UserModel } from "../models/userModel";
import ResponseStatus from "../utils/response";
import _ from "lodash";

const response = new ResponseStatus();

interface Track {
  id: number;
  title: string;
  album: string;
  duration: string;
  link: string;
  timeStamp: Date;
}

export const getListeningHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user_id = req.user!.id;
    // Find user-specific listening history
    const data = await historyModel.findOne({ user_id });
    if (data) {
      response.setSuccess(200, "successful", _.pick(data, ["_id", "history"]));
    } else response.setError(404, "No listening history found");
    return response.send(res);
  } catch (e) {
    response.setError(404, "Error fetching history");
    return response.send(res);
  }
};

export const addSongToHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user_id = req.user!.id;
    const songId = req.params.id;
    // check if user exists
    const userExists = await UserModel.findOne({ _id: user_id });
    if (!userExists) {
      response.setError(404, "user with this id doesn't exist");
      return response.send(res);
    }
    // Fetch song details
    const trackDetails = await fetchTrack(songId);

    // find user history from the database
    let history = await historyModel.findOne({ user_id });
    if (trackDetails) {
      const song_data = {
        ...trackDetails,
        id: songId,
        timestamp: Date.now(),
      };
      // if user doesn't have a history document, a new one is created
      if (!history) {
        const resp = await historyModel.create({
          user_id,
          history: [song_data],
        });
        response.setSuccess(
          201,
          "Listening history created",
          _.pick(resp, ["_id", "history"])
        );
        return response.send(res);
      }
      // if history exists, check if the track exists in the history array
      const existingTrack = history.history.find(
        (track: Track) => +track.id === +songId
      );

      // if the track exists, it is removed
      if (existingTrack) {
        await historyModel.findOneAndUpdate(
          { user_id },
          {
            $pull: { history: { $in: [existingTrack] } },
          }
        );
      }
      // track is added at position 0 of the history array
      await historyModel.findOneAndUpdate(
        { user_id },
        {
          $push: {
            history: {
              $each: [song_data],
              $position: 0,
            },
          },
        }
      );
      history = await historyModel.findOne({ user_id });
      response.setSuccess(
        200,
        "History updated successfully",
        _.pick(history, ["_id", "history"])
      );
      return response.send(res);
    }
    response.setError(400, "Track not found");
    return response.send(res);
  } catch (error: any) {
    response.setError(400, error.message);
    return response.send(res);
  }
};

export const removeSongFromHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user_id = req.user!.id;
    const songId = req.params.id;

    // Find history belonging to user
    let history = await historyModel.findOne({ user_id });
    // Return an error if the history document doesn't exist or the history array is empty
    if (!history || history.history.length === 0) {
      response.setError(400, "Listening history empty");
      return response.send(res);
    }
    // find and remove the track from the history array
    const existingTrack = history.history.find(
      (track: Track) => +track.id === +songId
    );
    if (existingTrack) {
      await historyModel.findOneAndUpdate(
        { user_id },
        {
          $pull: { history: { $in: [existingTrack] } },
        }
      );
      history = await historyModel.findOne({ user_id });
      response.setSuccess(
        200,
        "Track successfully removed from history",
        _.pick(history, ["_id", "history"])
      );
      return response.send(res);
    }
    response.setError(400, "track not found in history");
    return response.send(res);
  } catch (error: any) {
    response.setError(400, error.message);
    return response.send(res);
  }
};
