import { MongoClient } from "mongodb";

// Environment variables for database connection
const clusterAddress = process.env.MONGODB_CLUSTER_ADDRESS;
const dbUser = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DB_NAME;

// MongoDB connection URI
const uri = `mongodb+srv://${dbUser}:${dbPassword}@${clusterAddress}`;

// Create a new MongoClient
const client = new MongoClient(uri);

let database;

/**
 * Connects to the MongoDB database.
 * If the connection fails, it logs the error and exits the process.
 */
export async function connectToDatabase() {
  console.log("Trying to connect to db");
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log("Connected successfully to server");
    database = client.db(dbName);
  } catch (error) {
    console.log("Connection failed.", error);
    await client.close();
    console.log("Connection closed.");
    process.exit(1); // Exit the application if connection fails
  }
}

export function getDb() {
  if (!database) {
    throw new Error("You must connect to the database first!");
  }
  return database;
}
