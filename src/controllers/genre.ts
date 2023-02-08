import { Response, Request } from "express";
import { fetchGenres, fetchOne } from "../services/genres";
import { genreModel } from "../models/genreModel";
import playlistModel from "../models/playlistModel";
import ResponseStatus from "../utils/response";
import axios from "axios";

const responseStatus = new ResponseStatus();

export async function getGenres(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    // find all genres in database
    const genre = await genreModel.find({});

    // if genre returns empty, fetch genre from deezer api using axios
    if (genre.length === 0) {
      const allGenres = await fetchGenres();
      const data = await genreModel.insertMany(allGenres.data.data);
      responseStatus.setSuccess(200, "successful", data);
      return responseStatus.send(res);
    }

    // return successful response
    responseStatus.setSuccess(200, "successful", genre);
    return responseStatus.send(res);
  } catch (error) {
    responseStatus.setError(500, "error");
    return responseStatus.send(res);
  }
}

export async function getOneGenre(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    // get deezer genre id (Number) from request parameter
    const { id } = req.params;

    // return error if id is empty
    if (!id) {
      responseStatus.setError(400, "Please provide an Id");
      return responseStatus.send(res);
    }
    // check if id is a number, if not return error
    if (typeof +id !== "number") {
      responseStatus.setError(500, "error");
      return responseStatus.send(res);
    }

    // find genre by the id in database
    const newId = Number.parseInt(id, 10);
    const data = await genreModel.findOne({ id: newId });

    // if data returns empty, resturn 404 error
    if (!data) {
      const oneGenre = await fetchOne(newId);
      if (oneGenre.data.error) {
        responseStatus.setError(404, "Not Found");
        return responseStatus.send(res);
      }
      responseStatus.setSuccess(200, "successful", oneGenre);
      return responseStatus.send(res);
    }

    // if data, return return success
    responseStatus.setSuccess(200, "successful", data);
    return responseStatus.send(res);
  } catch (error) {
    responseStatus.setError(500, "error");
    return responseStatus.send(res);
  }
}

// controller to get all artists related to a particular genre
export const getArtistsByGenre = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  // get artists
  try {
    const response = await axios.get(
      `https://api.deezer.com/genre/${id}}/artists`
    );
    responseStatus.setSuccess(200, "successful", response.data.data);
    return responseStatus.send(res);
  } catch (error) {
    responseStatus.setError(500, "an error ocurred");
    return responseStatus.send(res);
  }
};

// controller to get all playlist associated to a particular genre
export const getPlaylistByGenre = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const playlists = await playlistModel.find({
      genreId: id,
      isPublic: true,
    });

    responseStatus.setSuccess(200, "successful", playlists);
    return responseStatus.send(res);
  } catch (error) {
    responseStatus.setError(500, "an error ocurred");
    return responseStatus.send(res);
  }
};

// get single artist details
export const getArtistDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  // get artist details
  try {
    const artist = await axios.get(`https://api.deezer.com/artist/${id}`);
    if (!artist.data.error) {
      responseStatus.setSuccess(200, "Successful", artist.data);
      return responseStatus.send(res);
    }
    responseStatus.setError(404, "Artist not found");
    return responseStatus.send(res);
  } catch (err) {
    responseStatus.setError(400, "an error occurred");
    return responseStatus.send(res);
  }
};
