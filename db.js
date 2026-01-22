import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.DB_NAME || "chat_agent_db";

let client = null;
let db = null;

export async function connectDB() {
  if (db) return db;

  if (!client) {
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 100,
      minPoolSize: 10,
      connectTimeoutMS: 5000,
    });
  }

  try {
    await client.connect();
    db = client.db(DB_NAME);
    
    const collection = db.collection("chat_history");
    await collection.createIndex({ userId: 1, createdAt: -1 });
    
    console.log("Connected to MongoDB and indexes verified");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function getChatCollection() {
  const database = await connectDB();
  return database.collection("chat_history");
}
