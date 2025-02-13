import { Request, Response } from "express";
import Event from "../models/Event";
import { eventSchema } from "../schemas/eventSchema";
import cloudinary from "../config/cloudinary";
import { getIO } from "../utils/socket";

// Upload Image to Cloudinary
const uploadImage = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};

// Create Event
export const createEvent = async (req: Request, res: Response) => {
  const validation = eventSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.errors);
  }

  const { name, description, date, location } = req.body;
  let imageUrl = "";

  if (req.file) {
    imageUrl = await uploadImage(req.file);
  }

  if (!req.user?.id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const newEvent = new Event({
      name,
      description,
      date,
      location,
      image: imageUrl,
      owner: req.user.id,
    });

    await newEvent.save();
    res.json(newEvent);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
};

// Get Events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().populate("createdBy", ["name"]);
    res.json(events);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
};

// Get Single Event
export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", [
      "name",
    ]);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
};

// Update Event
export const updateEvent = async (req: Request, res: Response) => {
  const validation = eventSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.errors);
  }

  const { name, description, date, location } = req.body;
  let imageUrl = "";

  if (req.file) {
    imageUrl = await uploadImage(req.file);
  }

  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    if (event.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, date, location, image: imageUrl } },
      { new: true }
    );

    res.json(event);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
};

// Delete Event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (event.owner.toString() !== req.user?.id) { 
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ msg: "Event removed" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
};

// Join Event
export const joinEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    if(!req.user) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: "User already joined" });
    }

    event.attendees.push(req.user.id);
    await event.save();

    const io = getIO();
    io.to(req.params.id).emit("attendeeJoined", {
      eventId: req.params.id,
      userId: req.user.id,
    });

    res.json(event);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
};

// Leave Event
export const leaveEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (!req.user) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    
    if (!event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: "User not joined" });
    }

    event.attendees = event.attendees.filter(
      (id) => id.toString() !== req.user!.id
    );
    await event.save();

    const io = getIO();
    io.to(req.params.id).emit("attendeeLeft", {
      eventId: req.params.id,
      userId: req.user.id,
    });

    res.json(event);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
};
