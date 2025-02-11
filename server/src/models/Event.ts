import mongoose, { Schema, model, Document } from "mongoose";

export interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  image: string;
  attendees: Schema.Types.ObjectId[];
  owner: Schema.Types.ObjectId;
}

const eventSchema: Schema<IEvent> = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String }, // URL from Cloudinary
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default model("Event", eventSchema);