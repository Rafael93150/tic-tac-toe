import express from "express";
import {
    createRoom,
    getCurrentRoom,
    joinRoom,
    leaveRoom,
} from "../routes/roomRoutes.js";

const router = express.Router();

router.post("/", createRoom);
router.get("/current", getCurrentRoom);
router.post("/leave", leaveRoom);
router.post("/join/:roomId", joinRoom);

export default router;
