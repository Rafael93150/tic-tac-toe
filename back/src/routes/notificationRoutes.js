import { usersLogged, io } from "../../server.js";

export const sendNotification = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message)
            return res.status(400).json({ error: "Message not provided" });
        /** 
         * Cibler client :
         * if (recipient) {
            const user = usersLogged.find((user) => user.id === recipient);
            if (!user)
                return res.status(404).json({ error: "Recipient not found" });

            io.to(user.socketId).emit("sendNotification", {
                message,
                recipient,
            });

            res.status(200).json({
                message: "Notification sent successfully.",
        }); */
        /* usersLogged.forEach((user) => {
            io.to(user.socketId).emit("sendNotification", {
                message,
            });
        }); */

        res.status(200).json({
            message: "Notification sent successfully to all connected users.",
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getConnectedUsers = async (req, res) => {
    try {
        res.json(usersLogged);
    } catch (error) {
        console.error("Error fetching connected users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
