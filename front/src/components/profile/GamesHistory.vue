<script setup>
import { useMainStore } from "@/stores/main";
import { onMounted, reactive } from "vue";
import axiosInstance from "@/utils/axiosInstance";
import { FaceFrownIcon, FaceSmileIcon } from "@heroicons/vue/24/outline";

const mainStore = useMainStore();
const currentUser = mainStore.currentUser;

const gamesHistory = reactive([]);

onMounted(() => {
	axiosInstance
		.get(`/games/history`)
		.then((response) => {
			gamesHistory.push(...response.data);
		})
		.catch((error) => {
			console.log(error);
		});
});

const otherPlayer = (game) => {
	return game.players.find(
		(player) => player._id.toString() !== currentUser._id
	);
};

const isFirstPlayer = (game) => {
	return game.players[0]._id === currentUser._id;
};

const isWinner = (game) => {
	return game.winner === currentUser._id;
};
</script>

<template>
	<div
		v-for="game in gamesHistory"
		:key="game._id"
		class="flex items-center justify-between p-4 w-full text-sm text-gray-500"
		:class="isWinner(game) ? 'bg-green-50' : 'bg-red-50'"
	>
		<div class="flex flex-row items-center">
			<FaceSmileIcon
				v-if="isWinner(game)"
				class="h-6 w-6 text-green-500"
			/>
			<FaceFrownIcon v-else class="h-6 w-6 text-red-500" />
			<div class="flex flex-col ml-4">
                <h4 class="text-sm font-bold uppercase" :class="isWinner(game) ? 'text-green-500' : 'text-red-500'">
                    {{ isWinner(game) ? "Victoire" : "Défaite" }}
                </h4>
				<p>
					Vous avez
					<span
						:class="
							isWinner(game) ? 'text-green-500' : 'text-red-500'
						"
					>
						{{ isWinner(game) ? "gagné" : "perdu" }}
					</span>
					contre
					<span style="font-weight: bold">
						{{ otherPlayer(game).username }}
					</span>
				</p>
				<p class="text-xs text-gray-400">
					{{ new Date(game.createdAt).toLocaleString("fr-FR") }}
				</p>
			</div>
		</div>
		<div class="flex flex-row items-center">
			<div class="flex flex-col mr-5">
				<div class="flex items-center space-x-2">
					<p class="text-red-500">X</p>
					<p class="text-xs">
						{{
							isFirstPlayer(game)
								? "Vous"
								: otherPlayer(game).username
						}}
					</p>
				</div>
				<div class="flex items-center space-x-2">
					<p class="text-indigo-600">O</p>
					<p class="text-xs">
						{{
							isFirstPlayer(game)
								? otherPlayer(game).username
								: "Vous"
						}}
					</p>
				</div>
			</div>
			<table class="w-20 h-20">
				<tbody>
					<tr
						v-for="(row, rowIndex) in game.gameBoard"
						:key="rowIndex"
					>
						<td
							v-for="(cell, cellIndex) in row"
							:key="cellIndex"
							class="w-6 h-6 text-center border border-gray-200 text-sm p-0 m-0 bg-white"
							:class="{
								'text-red-500': cell === 'X',
								'text-indigo-600': cell === 'O',
							}"
						>
							{{ cell }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<style>
td:last-child {
	border-bottom-width: 1px;
}
</style>
