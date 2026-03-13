import express from "express";
import { addPlayer, getPlayers, getPlayerById, deletePlayer } from "../controllers/playerController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/add", adminAuth, addPlayer);
router.get("/", getPlayers);
router.get("/:id", getPlayerById);
router.delete("/:id", deletePlayer);

export default router;