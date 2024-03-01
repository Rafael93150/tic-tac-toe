import express from "express";
import { play } from "../routes/gameRoutes.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/play", authMiddleware, play);

export default router;
