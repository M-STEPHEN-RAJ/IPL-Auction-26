import express from "express";
import { addPlayer, getPlayers } from "../controllers/playerController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/add", adminAuth, addPlayer);
router.get("/", getPlayers);

export default router;