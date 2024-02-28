import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import Message from "./src/models/message.js";

const PORT = process.env.PORT || 3000;
app.set("port", PORT);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true,
    },
});

let usersLogged = [];
let connectedUsers = [];
let usersActifs = [];

io.on("connection", (socket) => {
    socket.on("usersActifs", (user) => {
        usersActifs.push({ username: user.username, socketId: socket.id });
        io.emit("usersActifs", usersActifs);
    });

    socket.on("deleteMessage", async (messageId) => {
        try {
            await Message.findByIdAndDelete(messageId);
            io.emit("deleteMessage", messageId);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("join", (userId) => {
        connectedUsers.push({ userId, socketId: socket.id });
    });

    socket.on("disconnect", () => {
        const userDisconnected = usersLogged.find(
            (user) => user.socketId === socket.id
        );
        usersLogged = usersLogged.filter((user) => user.socketId !== socket.id);
        connectedUsers = connectedUsers.filter(
            (user) => user.socketId !== socket.id
        );
        usersActifs = usersActifs.filter((user) => user.socketId !== socket.id);
        io.emit("leaveChat", userDisconnected);
    });
});

app.set("socketio", io);

export { usersActifs, io };
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
