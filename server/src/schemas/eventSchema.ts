import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(3, "Event description is required"),
  date: z.date(),
  location: z.string().min(1, "Event location is required"),
  image: z.string().optional(),
});
