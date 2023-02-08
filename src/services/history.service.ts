import axios from "axios";

export const fetchTrack = async (
  id: string
): Promise<Record<string, unknown>> => {
  try {
    // Fetch song from deezer api by id
    const { data } = await axios.get(`https://api.deezer.com/track/${id}`);
    if (data.error) throw new Error("Track not found");
    const albumImg = data.album.cover;
    const {
      title,
      duration,
      album: { title: album },
      link,
      preview,
      artist,
    } = data;

    return { title, duration, album, link, preview, artist, albumImg };
  } catch (err: any) {
    throw new Error(err.message);
  }
};
