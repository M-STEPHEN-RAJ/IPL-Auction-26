import express from "express";
import { addTeam, getTeams } from "../controllers/teamController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/add", adminAuth, addTeam);
router.get("/", getTeams);

export default router;