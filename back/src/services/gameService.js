import { Types } from "mongoose";
import Room from "../models/room.js";

export const play = async ({ userId, row, col }) => {
	const room = await Room.findOne({
		players: userId,
		gameOver: false,
	}).populate("players", "username color");

	if (!room) return { error: "Room not found" };
	if (room.activePlayer.toString() !== userId)
		return { error: "It's not your turn" };
	if (room.gameBoard[row][col] !== "") return { error: "Invalid move" };
	room.gameBoard[row][col] =
		userId === room.players[0]._id.toString() ? "X" : "O";
	const gameOver = isGameOver(room.gameBoard);
	if (gameOver) {
		room.gameOver = true;
		room.winner = room.activePlayer;
	} else {
		room.activePlayer = new Types.ObjectId(
			room.players.find((player) => player._id.toString() !== userId)
		);
	}
	await room.save();

	return room;
};

const isGameOver = (gameBoard) => {
	const rows = gameBoard;
	const cols = [
		[gameBoard[0][0], gameBoard[1][0], gameBoard[2][0]],
		[gameBoard[0][1], gameBoard[1][1], gameBoard[2][1]],
		[gameBoard[0][2], gameBoard[1][2], gameBoard[2][2]],
	];
	const diagonals = [
		[gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]],
		[gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]],
	];

	const allLines = [...rows, ...cols, ...diagonals];
	for (const line of allLines) {
		if (line.every((cell) => cell === "X")) return true;
		if (line.every((cell) => cell === "O")) return true;
	}

	return false;
};
