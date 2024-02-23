import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
	roomId: {
		type: String,
		required: true,
		unique: true,
	},
	players: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	gameBoard: {
		type: [[String]],
		default: [
			["", "", ""],
			["", "", ""],
			["", "", ""],
		],
	},
	activePlayer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	gameOver: {
		type: Boolean,
		default: false,
	},
	winner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
