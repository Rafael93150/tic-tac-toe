<script setup>
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();
const router = useRouter();

const emit = defineEmits(["game-leaved"]);

const leaveGame = () => {
	mainStore.leaveGame();
	emit("game-leaved");
};
</script>

<template>
	### Plateau de jeu ###
	<!-- bouton abandonner -->
	<div class="flex justify-center">
		<button
			class="px-4 py-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-500"
			@click="leaveGame"
		>
			Abandonner
		</button>
	</div>
</template>
