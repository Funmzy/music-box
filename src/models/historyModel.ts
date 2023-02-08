import { Schema, model, SchemaTypes } from "mongoose";
import { HISTORY } from "../types/types";

const trackSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  album: { type: String, required: true },
  duration: { type: String, required: true },
  link: { type: String, required: true },
  preview: { type: String, required: true },
  artist: { type: SchemaTypes.Mixed, required: true },
  albumImg: { type: String, required: true },
  timestamp: { type: Date, default: Date.now() },
});
const historySchema = new Schema<HISTORY>({
  user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
  history: [trackSchema],
});
const historyModel = model("History", historySchema);
export default historyModel;
