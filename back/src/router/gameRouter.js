import express from "express";
import { play, getGamesHistory} from "../routes/gameRoutes.js";

const router = express.Router();

router.post("/play", play);
router.get("/history", getGamesHistory);

export default router;
