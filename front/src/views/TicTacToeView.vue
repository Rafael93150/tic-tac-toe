<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SidebarChat from "@/components/game/SidebarChat.vue";
import GameBoard from "@/components/game/GameBoard.vue";
import GameStarter from "@/components/game/GameStarter.vue";
import { useMainStore } from "@/stores/main";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

const mainStore = useMainStore();
const router = useRouter();

const state = reactive({
	currentGame: null,
});

const handleGameCreated = (game) => {
	state.currentGame = game;
	router.push(`/game/${state.currentGame.roomId}`);
};

const handleGameLeaved = () => {
	state.currentGame = null;
	router.push("/");
};

const handleGameJoined = (game) => {
	state.currentGame = game;
	router.push(`/game/${game.roomId}`);
};

onMounted(async () => {
	state.currentGame = await mainStore.fetchCurrentGame();
	if (state.currentGame) {
		router.push(`/game/${state.currentGame.roomId}`);
	} else {
		router.push("/");
	}
});
</script>

<template>
	<LayoutAuthenticated>
		<div v-if="state.currentGame" class="flex flex-row w-full h-full">
			<div class="flex-1 flex flex-col items-center justify-center">
				<!-- Informations liées à la partie -->
				<div
					class="flex flex-col items-center justify-center w-full max-w-md"
				>
					<h1 class="text-3xl font-bold text-center">Morpion</h1>
				</div>
				<!-- Plateau de jeu -->
				<GameBoard @game-leaved="handleGameLeaved" />
			</div>
			<SidebarChat :room="state.currentGame" />
		</div>
		<GameStarter
			v-else
			@game-created="handleGameCreated"
			@game-joined="handleGameJoined"
		/>
	</LayoutAuthenticated>
</template>

<style>
.container {
	height: 100vh;
}
</style>
