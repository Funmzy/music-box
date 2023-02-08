import { Schema, model } from "mongoose";
import { Album } from "../types/types";

const trackSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  preview: {
    type: String,
  },
  md5_image: {
    type: String,
  },
  duration: {
    type: String,
  },
  artist: {
    id: String,
    name: String,
  },
});

const contributorSchema = new Schema({
  name: {
    type: String,
  },
});

const albumSchema = new Schema<Album>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    cover_small: {
      type: String,
      required: true,
    },
    cover_medium: {
      type: String,
      required: true,
    },
    cover_big: {
      type: String,
      required: true,
    },
    cover_xl: {
      type: String,
      required: true,
    },
    genre_id: {
      type: Number,
      required: true,
    },
    artist: {
      id: String,
      name: String,
    },
    duration: {
      type: Number,
    },
    nb_tracks: {
      type: Number,
    },
    release_date: Date,
    tracks: { type: [trackSchema] },
    contributors: { type: [contributorSchema] },
    likes: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    listened: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    listeningCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

albumSchema.virtual("Recently_played", {
  ref: "Recent_play",
  localField: "_id",
  foreignField: "directory_info",
  justOne: false,
  match: { isActive: false },
});

export const AlbumModel = model("Album", albumSchema);
