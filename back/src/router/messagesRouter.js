import express from "express";
const router = express.Router();
import {
    getChatMessages,
    getRoomMessages,
    getMessageById,
    createMessage,
    updateMessage,
    deleteMessage,
    getMessageByIdWithUserDetails
} from "../routes/messagesRoutes.js";

router.get("/", getChatMessages);
router.get("/room/:roomId", getRoomMessages);
router.get("/:messageId", getMessageById);
router.get("/:messageId/populated", getMessageByIdWithUserDetails);
router.post("/", createMessage);
router.put("/:messageId", updateMessage);
router.delete("/:messageId", deleteMessage);

export default router;
