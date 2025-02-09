import { Schema, model, models } from "mongoose";
import { title } from "process";

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, enum: ["tech", "music", "sports"], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

export default models.Event || model("Event", EventSchema);