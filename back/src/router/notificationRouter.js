import express from "express";
import {
    sendNotification,
    getConnectedUsers,
} from "../routes/notificationRoutes.js";

const router = express.Router();

router.post("/send-notification", sendNotification);
router.get("/connected-users", getConnectedUsers);

export default router;
