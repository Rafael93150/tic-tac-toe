<script setup>
const props = defineProps({
	isGameStarted: Boolean,
	isGameFinished: Boolean,
});

const emit = defineEmits(["leave-game"]);
</script>

<template>
	<button
		class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-500"
		@click="emit('leave-game')"
	>
		{{
			props.isGameFinished
				? "Revenir à l'accueil"
				: props.isGameStarted
				? "Abandonner la partie"
				: "Annuler la recherche"
		}}
	</button>
</template>
