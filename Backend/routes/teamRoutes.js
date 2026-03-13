import express from "express";
import { addTeam, getTeams, getTeamById, buyPlayer, markUnsold, removePlayerFromTeam } from "../controllers/teamController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/add", adminAuth, addTeam);
router.get("/", getTeams);
router.get("/:id", getTeamById);
router.post("/buy-player", adminAuth, buyPlayer);
router.post("/unsold-player", adminAuth, markUnsold);
router.post("/remove-player", removePlayerFromTeam);

export default router;