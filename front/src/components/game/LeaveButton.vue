<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
	isGameStarted: Boolean,
	isGameFinished: Boolean,
});

const emit = defineEmits(["leave-game"]);

// Local state
const isGameFinishedLocal = ref(props.isGameFinished);

// Load the game state from localStorage on mount
onMounted(() => {
	const savedState = localStorage.getItem("isGameFinished");
	if (savedState) {
		isGameFinishedLocal.value = JSON.parse(savedState);
	}
});

// Watch for changes to isGameFinished and save to localStorage
watch(isGameFinishedLocal, (newVal) => {
	localStorage.setItem("isGameFinished", JSON.stringify(newVal));
});

// Handle button click
const handleLeaveGame = () => {
	isGameFinishedLocal.value = true;
	emit("leave-game");
};
</script>

<template>
	<button
		class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-500"
		@click="handleLeaveGame"
	>
		{{
			isGameFinishedLocal.value
				? "Revenir à l'accueil"
				: props.isGameStarted
				? "Abandonner la partie"
				: "Annuler la recherche"
		}}
	</button>
</template>
