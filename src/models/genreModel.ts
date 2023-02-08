import { Schema, model } from "mongoose";

const genreSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    picture_small: {
      type: String,
      required: true,
    },
    picture_medium: {
      type: String,
      required: true,
    },
    picture_big: {
      type: String,
      required: true,
    },
    picture_xl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// create relationship between genre and playlist
genreSchema.virtual("playlist", {
  ref: "Playlist",
  localField: "_id",
  foreignField: "ownerId",
});

export const genreModel = model("Genre", genreSchema);
