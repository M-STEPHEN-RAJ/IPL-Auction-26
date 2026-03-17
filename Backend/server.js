import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

connectDB();

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(cookieParser());

app.use("/admin", adminRoutes);
app.use("/players", playerRoutes);
app.use("/teams", teamRoutes);

app.get("/", (req, res) => {
  res.send("Server is Live!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);