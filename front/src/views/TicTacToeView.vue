<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SidebarChat from "@/components/game/SidebarChat.vue";
import GameBoard from "@/components/game/GameBoard.vue";
import GameStarter from "@/components/game/GameStarter.vue";
import { useMainStore } from "@/stores/main";
import { computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import io from "socket.io-client";

const mainStore = useMainStore();
const router = useRouter();
const socket = io("http://localhost:3000");

const state = reactive({
	currentGame: null,
});

const handleGameCreated = (game) => {
	state.currentGame = game;
	router.push(`/game/${state.currentGame.roomId}`);
};

const leaveGame = () => {
	mainStore.leaveGame();
	if (state.currentGame && state.currentGame.players.length > 1) {
		socket.emit("userLeftGame", {
			roomId: state.currentGame.roomId,
			user: mainStore.currentUser,
		});
	}
	state.currentGame = null;
	router.push("/");
};

const handleGameJoined = (game) => {
	router.push(`/game/${game.roomId}`);
	state.currentGame = game;
	socket.emit("userJoinedGame", {
		roomId: game.roomId,
		user: mainStore.currentUser,
	});
};

onMounted(async () => {
	state.currentGame = await mainStore.fetchCurrentGame();
	if (state.currentGame) {
		router.push(`/game/${state.currentGame.roomId}`);
	} else {
		router.push("/");
	}
});

socket.on("userJoinedGame", ({ roomId, user }) => {
	if (
		roomId !== state.currentGame.roomId ||
		user._id === mainStore.currentUser._id
	)
		return;
	state.currentGame.players.push(user);
});

socket.on("userLeftGame", ({ roomId, user }) => {
	if (
		user._id === mainStore.currentUser._id ||
		roomId !== state.currentGame.roomId
	)
		return;
	state.currentGame = null;
});

const isGameStarted = computed(() => {
	return state.currentGame && state.currentGame.players.length === 2;
});
</script>

<template>
	<LayoutAuthenticated>
		<div class="vh100">
			<!-- Game page -->
			<div v-if="state.currentGame" class="flex flex-row w-full h-full">
				<div class="flex-1 flex flex-col items-center justify-center">
					<div
						v-if="isGameStarted"
						class="flex flex-col items-center"
					>
						<h1 class="text-xl font-bold text-indigo-600">
							{{ state.currentGame.players[0].username }} vs
							{{ state.currentGame.players[1].username }}
						</h1>
						<p class="text-center text-sm text-gray-500">
							{{ state.currentGame.players[0].username }} joue
							avec les <span class="text-red-500">X</span>
						</p>
						<p class="text-center text-sm text-gray-500">
							{{ state.currentGame.players[1].username }} joue
							avec les <span class="text-indigo-600">O</span>
						</p>
						<GameBoard
							class="my-4"
							:board="state.currentGame.board"
						/>
					</div>
					<div v-else class="flex flex-col items-center">
						<h1 class="text-xl font-bold text-indigo-600">
							En attente d'un adversaire...
						</h1>
						<!-- loading -->
						<svg
							class="animate-spin h-5 w-5 text-indigo-600 my-10"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.009 8.009 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.86 0-7.169-2.21-8.832-5.709l2.832-1.291z"
							></path>
						</svg>
					</div>

					<!-- Give Up or Cancel button -->
					<button
						class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-500"
						@click="leaveGame"
					>
						{{ isGameStarted ? "Abandonner" : "Annuler" }}
					</button>
				</div>
				<SidebarChat v-if="isGameStarted" :room="state.currentGame" />
			</div>

			<!-- Game reasearch page -->
			<div v-else class="flex flex-row w-full h-full">
				<div class="flex-1 flex flex-col items-center justify-center">
					<div
						class="flex flex-col items-center justify-center w-full max-w-md"
					>
						<GameStarter
							@game-created="handleGameCreated"
							@game-joined="handleGameJoined"
						/>
					</div>
				</div>
			</div>
		</div>
	</LayoutAuthenticated>
</template>

<style>
.vh100 {
	height: 100vh;
}
</style>
