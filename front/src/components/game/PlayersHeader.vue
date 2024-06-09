<script setup>
const props = defineProps({
	players: Array,
});
</script>

<template>
	<div>
		<h1 class="text-xl font-bold">
			<span
				:style="{
					color: props.players[0].color,
				}"
			>
				{{ props.players[0].username }}
			</span>
			<small class="mx-4 text-gray-700 font-normal">vs</small>
			<span
				:style="{
					color: props.players[1].color,
				}"
			>
				{{ props.players[1].username }}
			</span>
		</h1>
		<p class="text-center text-sm text-gray-500">
			{{ props.players[0].username }} joue avec les
			<span class="text-red-500">X</span>
		</p>
		<p class="text-center text-sm text-gray-500">
			{{ props.players[1].username }} joue avec les
			<span class="text-indigo-600">O</span>
		</p>
	</div>
</template>
