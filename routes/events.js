import { Router } from "express";

// Import the getDb function to access the database instance
import { getDb } from "../data/database.js";

const router = Router();

router.get("/", async (req, res) => {
  // Get the database instance
  const db = getDb();
  // Find all events in the 'events' collection and convert them to an array
  const allEvents = await db.collection("events").find().toArray();
  res.json({ events: allEvents });
});

router.post("/", async (req, res) => {
  // Get the database instance
  const db = getDb();
  // Get event data from the request body
  const eventData = req.body;
  // Insert the new event data into the 'events' collection
  const result = await db.collection("events").insertOne({ ...eventData });
  // Respond with a 201 status code, a success message, and the created event
  res.status(201).json({
    message: "Event created.",
    event: { ...eventData, id: result.insertedId },
  });
});

export default router;
