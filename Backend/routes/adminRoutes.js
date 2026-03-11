import express from "express";
import { createAdmin, loginAdmin, logoutAdmin } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

export default router;