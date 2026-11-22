import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import serviceRoutes from "./src/routes/service.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";

import { connectMongoDB, connectMongoose } from "./src/config/db.js";
import { auth } from "./src/config/auth.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Better Auth Handler
app.all("/api/auth/*splat", toNodeHandler(auth));

// JSON Middleware
app.use(express.json());

// API Routes
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SalonBook Server is Running!",
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectMongoDB();
    await connectMongoose();

    app.listen(PORT, () => {
      console.log(`SalonBook Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Failed:", error.message);
    process.exit(1);
  }
};

startServer();
