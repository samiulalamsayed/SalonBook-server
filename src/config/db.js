import "dotenv/config";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

export const mongoClient = new MongoClient(process.env.MONGODB_URI);

let database;

export const connectMongoDB = async () => {
  try {
    if (database) return database;

    await mongoClient.connect();

    database = mongoClient.db(process.env.MONGODB_DB);

    console.log("Native MongoDB Connected Successfully!");

    return database;
  } catch (error) {
    console.error("Native MongoDB Connection Failed:", error.message);
    throw error;
  }
};

export const connectMongoose = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB,
    });

    console.log("Mongoose Connected Successfully!");

    return mongoose.connection;
  } catch (error) {
    console.error("Mongoose Connection Failed:", error.message);
    throw error;
  }
};
