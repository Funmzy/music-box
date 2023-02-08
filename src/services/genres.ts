import axios, { AxiosResponse, AxiosTransformer } from "axios";
// fetch genres from deezer using axios call
export const fetchGenres = async (): Promise<AxiosResponse<any>> => {
  const url = process.env.GENRE_URL as string;
  const response = await axios.get(url);
  return response;
};

// fetch a single genre from deezer api using axios
export const fetchOne = async (id: number): Promise<AxiosResponse<any>> => {
  const url = process.env.GENRE_URL as string;
  try {
    const response = await axios.get(`${url}/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.data.error.message);
  }
};

// fetch user query from deezer api
export const fetchAllQuery = async (
  search: string
): Promise<AxiosTransformer[]> => {
  const albumUrl = process.env.SEARCH_ALBUM_URL;
  const artistUrl = process.env.SEARCH_ARTIST_URL;
  try {
    const responseAlbum = (await axios.get(`${albumUrl}${search}`)).data.data;
    const responseArtist = (await axios.get(`${artistUrl}${search}`)).data.data;

    const responseResult = await Promise.all([responseAlbum, responseArtist]);

    return responseResult;
  } catch (error: any) {
    throw new Error(error.response);
  }
};
