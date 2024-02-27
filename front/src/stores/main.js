import { defineStore } from "pinia";
import axiosInstance from "@/utils/axiosInstance";

export const useMainStore = defineStore("main", {
	state: () => {
		const user = JSON.parse(localStorage.getItem("user"));
		const currentGame = null;
		return {
			currentUser: { ...user, response: null },
			currentGame,
		};
	},
	getters: {
		getUser() {
			return this.currentUser;
		},
		getCurrentGame() {
			return this.currentGame;
		},
	},
	actions: {
		async setUser(payload) {
			for (const key of Object.keys(payload)) {
				this.currentUser[key] = payload[key];
			}
		},
		setCurrentGame(game) {
			this.currentGame = game;
			// TODO: return current game
		},
		async leaveGame() {
			const response = await axiosInstance.post("/rooms/leave");
			return response.data;
		},
		async fetchCurrentGame() {
			const response = await axiosInstance.get("/rooms/current");
			return response.data;
		},
	},
});
