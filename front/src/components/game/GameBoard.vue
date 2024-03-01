<script setup>
import { useMainStore } from "@/stores/main";
import { computed } from "vue";

const mainStore = useMainStore();
const props = defineProps({
	board: Array,
	activePlayer: String,
});

const currentUser = mainStore.currentUser;
const isCurrentUserTurn = computed(() => {
	return currentUser._id.toString() === props.activePlayer;
});

const emit = defineEmits(["cell-clicked"]);
</script>

<template>
	<div class="h-96 w-96 bg-gray-50 justify-center items-center flex">
		<table class="container h-full w-full">
			<tbody>
				<tr v-for="(row, rowIndex) in board" :key="rowIndex">
					<td
						v-for="(cell, cellIndex) in row"
						:key="cellIndex"
						class="h-24 w-24 border-2 border-gray-300 text-5xl text-center font-bold hover:bg-gray-100"
						:class="
							isCurrentUserTurn
								? 'cursor-pointer'
								: 'cursor-not-allowed', cell === 'X' ? 'text-red-500' : 'text-indigo-600'
						"
						@click="emit('cell-clicked', rowIndex, cellIndex)"
					>
						{{ cell }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style>
td:last-child {
	border-bottom-width: 2px;
}
</style>
