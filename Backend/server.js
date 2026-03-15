import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

dotenv.config();

const app = express();

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
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));