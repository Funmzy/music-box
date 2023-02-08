import { Schema, model } from "mongoose";
import { RECENTLY_PLAYED } from "../types/types";

const RecentlyPlayedSchema = new Schema<RECENTLY_PLAYED>(
  {
    player_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    directory_info: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Playlist", "Artist", "Album"],
    },
    directory_type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const RecentlyPlayedModel = model("Recent_play", RecentlyPlayedSchema);
