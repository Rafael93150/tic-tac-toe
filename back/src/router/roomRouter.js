import express from "express";
import {
	createRoom,
	getCurrentRoom,
	joinRoom,
	leaveRoom,
} from "../routes/roomRoutes.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createRoom);
router.get("/current", authMiddleware, getCurrentRoom);
router.post("/leave", authMiddleware, leaveRoom);
router.post("/join/:roomId", authMiddleware, joinRoom);

export default router;
