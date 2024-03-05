import express from "express";
import { play, getGamesHistory} from "../routes/gameRoutes.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/play", authMiddleware, play);
router.get("/history", authMiddleware, getGamesHistory);

export default router;
