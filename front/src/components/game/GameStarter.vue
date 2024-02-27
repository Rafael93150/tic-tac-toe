<script setup>
import { useRouter } from "vue-router";
import {
	ArrowRightEndOnRectangleIcon,
	PlusCircleIcon,
} from "@heroicons/vue/24/outline";
import { ref } from "vue";
import axiosInstance from "@/utils/axiosInstance";
import { useMainStore } from "@/stores/main";

const router = useRouter();
const store = useMainStore();

const roomCode = ref(null);

const emit = defineEmits(["game-created"]);

const createGame = () => {
	axiosInstance.post("/rooms").then((response) => {
		emit("game-created", response.data);
	});
};

const joinGame = () => {
	axiosInstance.post(`/rooms/join/${roomCode.value}`).then((response) => {
		emit("game-joined", response.data);
	});
};
</script>

<template>
	<div class="container flex flex-col items-center justify-center">
		<div
			class="flex flex-col items-center justify-center w-full max-w-md w-full h-full"
		>
			<h1 class="text-xl font-bold text-indigo-600">
				Trouvez une partie
			</h1>
			<div
				class="flex flex-col items-center justify-center w-full mt-6 rounded-md bg-white shadow-md p-6 bg-purple-50"
			>
				<!-- Create a party -->
				<div class="flex-col">
					<div class="flex flex-row items-center justify-center">
						<PlusCircleIcon class="w-8 h-8 text-indigo-500" />
						<div class="flex flex-col ml-4">
							<h4 class="text-ml font-bold text-indigo-600">
								Créer une partie
							</h4>
							<p class="text-center text-sm text-gray-500">
								Hébergez une partie pour jouer contre un
								adversaire
							</p>
						</div>
					</div>
					<button
						class="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
						@click="createGame"
					>
						Créer une partie
					</button>
				</div>
				<!-- Or -->
				<div class="relative w-full my-6">
					<hr
						class="my-4 border-gray-300 w-full absolute top-1/2 transform -translate-y-1"
					/>
					<small
						class="mx-auto bg-purple-50 px-2 text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2"
					>
						ou
					</small>
				</div>
				<!-- Join a party -->
				<div class="flex flex-col">
					<div class="flex flex-row items-center justify-center mt-6">
						<ArrowRightEndOnRectangleIcon
							class="w-8 h-8 text-indigo-500"
						/>
						<div class="flex flex-col ml-4">
							<h4 class="text-ml font-bold text-indigo-600">
								Rejoindre une partie
							</h4>
							<p class="text-center text-sm text-gray-500">
								Rejoignez une partie pour jouer contre un
								adversaire
							</p>
						</div>
					</div>
					<input
						type="text"
						class="w-full px-4 py-2 mt-4 border-2 border-gray-300 rounded-md relative relative"
						placeholder="Code de la partie"
						v-model="roomCode"
					/>
					<button
						class="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
						@click="joinGame"
					>
						Rejoindre une partie
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
