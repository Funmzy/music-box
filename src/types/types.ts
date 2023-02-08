import { Types, Document } from "mongoose";

export interface IUser extends Document<Types.ObjectId> {
  user: any;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  provider: string;
  token?: string;
  last_login?: string;
}

export interface REQUESTUSER {
  _id: string;
  id?: string;
  token?: string;
}

export interface ITrack {
  id: number;
  title: string;
  duration: string;
  artist: string;
  album: string;
  preview: string;
  albumImgUrl: string;
}

export interface IPlaylist {
  name: string;
  genreId: string;
  tracks?: ITrack[];
  isPublic: boolean;
  likes?: string[];
  ownerId?: string;
  listeningCount?: number;
  likesCount?: number;
  imgURL?: string;
}

export interface GENRE {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  type: string;
}

export interface HISTORY {
  userId: string;
  history: {
    id: number;
    title: string;
    album: string;
    duration: string;
    timeStamp: Date;
  }[];
}

export interface RECENTLY_PLAYED {
  player_id: string;
  directory_id: string;
  directory_info: string;
  directory_type: string;
}

export interface IArtist extends Document<Types.ObjectId> {
  id: number;
  name: string;
  share: string;
  likedBy: string[];
  likedCount: number;
  listeningCount: number;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  type: string;
}

export interface Album extends Document<Types.ObjectId> {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  genre_id: string;
  artist: {
    id: string;
  };
  tracklist: string;
  duration: number;
  nb_tracks: number;
  tracks: string[];
  contributors: string[];
  likes?: string[];
  listened?: string[];
  likeCount?: number;
  listeningCount?: number;
}

export type ResponseData = Record<string, any> | Record<string, any>[];
