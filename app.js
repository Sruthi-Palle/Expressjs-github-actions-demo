import bodyParser from "body-parser";
import express from "express";

import { connectToDatabase } from "./data/database.js";
import eventRoutes from "./routes/events.js";

const app = express();

app.use(bodyParser.json());

// Register event routes
app.use(eventRoutes);

/**
 * Starts the Express server after connecting to the database.
 */
async function startServer() {
  await connectToDatabase(); // Wait for the database connection to be established
  app.listen(process.env.PORT); // Start listening for requests
}

startServer();
