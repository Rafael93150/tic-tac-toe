import Room from "../models/room.js";

export const play = async (req, res) => {
	try {
		const row = req.body.row;
		const col = req.body.col;

		const room = await Room.findOne({
			players: req.user.userId,
			gameOver: false,
		}).populate("players", "username color");

		if (!room) return res.status(404).json({ error: "Room not found" });
		if (activePlayer !== req.user.userId)
			return res.status(400).json({ error: "It's not your turn" });
		if (room.gameBoard[row][col] !== "")
			return res.status(400).json({ error: "Invalid move" });
		if (req.user.userId === room.players[0]) room.gameBoard[row][col] = "X";
		else room.gameBoard[row][col] = "O";
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while checking if user is in game: ${error}`,
		});
	}
};

export const getGamesHistory = async (req, res) => {
	try {
		const gamesHistory = await Room.find({
			players: req.user.userId,
			gameOver: true,
		}).populate("players", "username color");
		res.status(200).json(gamesHistory);
	} catch (error) {
		res.status(500).json({
			error: `An error occurred while getting games history: ${error}`,
		});
	}
}