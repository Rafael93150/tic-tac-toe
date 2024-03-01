import User from "../models/user.js";
import Room from "../models/room.js";
import randomCharacters from "../lib/randomCharacters.js";

export const createRoom = async (req, res) => {
	try {
		const roomId = randomCharacters(6);
		const room = new Room({ roomId, players: [req.user.userId] });
		await room.save();
		const createdRoom = await Room.findOne({ roomId }).populate(
			"players",
			"username color"
		);
		res.status(201).json(createdRoom);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while creating room: ${error}`,
		});
	}
};

export const joinRoom = async (req, res) => {
	try {
		const room = await Room.findOne({
			roomId: req.params.roomId,
			gameOver: false,
		});
		if (room) {
			if (room.players.length === 2) {
				return res.status(400).json({ error: "Room is full" });
			}
			room.players.push(req.user.userId);
			await room.save();
			const joinedRoom = await Room.findOne({
				roomId: req.params.roomId,
			}).populate("players", "username color");
			res.status(200).json(joinedRoom);
		} else {
			res.status(404).json({ error: "Room not found" });
		}
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while joining room: ${error}`,
		});
	}
};

export const getCurrentRoom = async (req, res) => {
	try {
		const room = await Room.findOne({
			players: req.user.userId,
			gameOver: false,
		}).populate("players", "username");
		if (room) {
			res.status(200).json(room);
		} else {
			res.status(200).json(null);
		}
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while checking if user is in game: ${error}`,
		});
	}
};

export const leaveRoom = async (req, res) => {
	try {
		const room = await Room.findOne({
			players: req.user.userId,
			gameOver: false,
		});
		if (room) {
			room.gameOver = true;
			if (room.players.length < 2) {
				await Room.findByIdAndDelete(room._id);
				return res.status(200).json({ message: "Room deleted" });
			}
			room.winner = room.players.filter(
				(player) => player._id.toString() !== req.user.userId
			);
			await room.save();
			res.status(200).json(room);
		} else {
			res.status(404).json({ error: "Room not found" });
		}
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while leaving room: ${error}`,
		});
	}
};
