import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import Message from "./src/models/message.js";
import { play } from "./src/services/gameService.js";

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
let usersActifs = [];

io.on("connection", (socket) => {
	socket.on("joinChat", (user) => {
		usersLogged.push({ ...user, socketId: socket.id });
		io.emit("joinChat", user);
	});

	socket.on("newMessage", async (messageData) => {
		try {
			const { fromUser, toRoom, text } = messageData;

			const newMessage = new Message({
				fromUser,
				toRoom,
				text,
			});

			const savedMessage = await newMessage.save();

			const populatedMessage = await Message.findById(
				savedMessage._id
			).populate("fromUser", "username color");

			io.emit("newMessage", populatedMessage);
		} catch (err) {
			console.error(err);
		}
	});

	socket.on("editMessage", async (messageId, newText) => {
		try {
			await Message.findByIdAndUpdate(messageId, { text: newText });
			io.emit("editMessage", messageId, newText);
		} catch (err) {
			console.error(err);
		}
	});

	socket.on("deleteMessage", async (messageId) => {
		try {
			await Message.findByIdAndDelete(messageId);
			io.emit("deleteMessage", messageId);
		} catch (err) {
			console.error(err);
		}
	});

	socket.on("disconnect", () => {
		const userDisconnected = usersLogged.find(
			(user) => user.socketId === socket.id
		);
		usersLogged = usersLogged.filter((user) => user.socketId !== socket.id);
		io.emit("leaveChat", userDisconnected);
	});

	socket.on("userJoinedGame", ({ roomId, user }) => {
		io.emit("userJoinedGame", { roomId, user });
	});

	socket.on("userLeftGame", ({ roomId, user }) => {
		io.emit("userLeftGame", { roomId, user });
	});

	socket.on("playerPlayed", async ({ userId, row, col }) => {
		const room = await play({ userId, row, col });
		io.emit("playerPlayed", room);
	});
});

app.set("socketio", io);

export { usersActifs, io };
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
