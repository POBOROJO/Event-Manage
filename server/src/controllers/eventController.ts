import { Request, Response } from "express";
import Event from "../models/Event";
import { eventSchema } from "../schemas/eventSchema";
import cloudinary from "../config/cloudinary";
import { getIO } from "../utils/socket";

import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Upload Image to Cloudinary
const uploadImage = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};

// Create Event
export const createEvent = async (req: Request, res: Response) => {
  const validation = eventSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }

  const { name, description, date, location } = req.body;
  let imageUrl = "";

  if (req.file) {
    imageUrl = await uploadImage(req.file);
  }

  try {
    const newEvent = new Event({
      name,
      description,
      date,
      location,
      image: imageUrl,
      owner: req.user._id,
    });

    await newEvent.save();
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
