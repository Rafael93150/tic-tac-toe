<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SidebarChat from "@/components/game/SidebarChat.vue";
import GameBoard from "@/components/game/GameBoard.vue";
import GameStarter from "@/components/game/GameStarter.vue";
import { useMainStore } from "@/stores/main";
import { computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import io from "socket.io-client";
import PlayersHeader from "@/components/game/PlayersHeader.vue";
import LookingForPlayer from "@/components/game/LookingForPlayer.vue";
import LeaveButton from "@/components/game/LeaveButton.vue";

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
		room: game,
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

socket.on("userJoinedGame", ({ room, user }) => {
	if (room.roomId !== state.currentGame.roomId) return;
	state.currentGame = room;
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

const playerTurn = computed(() => {
	return state.currentGame.players.find(
		(player) => player._id === state.currentGame.activePlayer
	);
});

const handleCellClicked = (row, col) => {
	socket.emit("playerPlayed", {
		userId: mainStore.currentUser._id,
		row,
		col,
	});
};

socket.on("playerPlayed", (room) => {
	if (room.error) {
		alert(room.error);
		return;
	}
	state.currentGame = room;
	if (room.winner) {
		const winner = room.players.find(
			(player) => player._id === room.winner
		);
		setTimeout(() => {
			alert(`${winner.username} a gagné!`);
		}, 50);
		clearTimeout();
	}
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
						<PlayersHeader
							class="my-4"
							:players="state.currentGame.players"
						/>
						<div class="text-2xl font-bold mb-4">
							Au tour de 
							<span :style="{ color: playerTurn.color }" class="bg-gray-100 px-2 py-1 rounded-md">
								{{ playerTurn.username }}
							</span>
						</div>
						<GameBoard
							class="my-4"
							:board="state.currentGame.gameBoard"
							:activePlayer="state.currentGame.activePlayer"
							@cell-clicked="handleCellClicked"
						/>
					</div>
					<div v-else class="flex flex-col items-center">
						<p class="text-2xl font-bold mb-4">
							Code de la partie:
							<span class="text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md ml-2">
								{{ state.currentGame.roomId }} 
							</span>
						</p>
						<LookingForPlayer />
					</div>

					<LeaveButton
						:isGameStarted="isGameStarted"
						@leave-game="leaveGame"
					/>
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
