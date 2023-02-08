import { Schema, model } from "mongoose";
import { IPlaylist } from "../types/types";

const playlistSchema = new Schema<IPlaylist>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      unique: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    tracks: [
      {
        id: Number,
        title: String,
        duration: String,
        artist: String,
        album: String,
        preview: String,
        albumImgUrl: String,
      },
    ],
    genreId: {
      type: Schema.Types.ObjectId,
      ref: "Genre",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    listeningCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    imgURL: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

playlistSchema.pre("find", async function (next) {
  try {
    this.populate({ path: "genreId", select: "name" });
    next();
  } catch (error) {
    // eslint-disable-next-line no-console
  }
});

playlistSchema.pre("find", async function (next) {
  try {
    this.populate({ path: "ownerId", select: "firstName lastName" });
    next();
  } catch (error) {
    // eslint-disable-next-line no-console
  }
});

playlistSchema.virtual("Recently_played", {
  ref: "Recent_play",
  localField: "_id",
  foreignField: "directory_info",
  justOne: false,
  match: { isActive: false },
});

export default model<IPlaylist>("Playlist", playlistSchema);
