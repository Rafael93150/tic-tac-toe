<script setup lang="ts">
import { onMounted, reactive } from "vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import axiosInstance from "@/utils/axiosInstance";
import { io } from "socket.io-client";

const socket = io("https://tic-tac-toe-server-thgx.onrender.com");

const state = reactive({
	message: "",
	selectedUser: null,
	users: [],
});

const fetchConnectedUsers = async () => {
	try {
		const response = await axiosInstance.get(
			"/notifications/connected-users"
		);
		state.users = response.data;
	} catch (error) {
		console.error("Error fetching connected users:", error);
	}
};

onMounted(fetchConnectedUsers);

const sendNotification = async () => {
	try {
		socket.emit("notification", {
			message: state.message,
			recipient: state.selectedUser,
		});
		state.message = "";
		state.selectedUser = null;
	} catch (error) {
		console.error("Error sending notification:", error);
	}
};
</script>

<template>
	<LayoutAuthenticated>
		<div class="flex flex-row w-full vh100">
			<div class="flex-1 flex flex-col items-center justify-center">
				<div
					class="flex flex-col items-center justify-center w-full max-w-md"
				>
					<h1 class="text-xl font-bold text-indigo-600">
						Envoyer une notification
					</h1>
					<div
						class="mt-5 flex flex-col items-center justify-center w-full mt-6 rounded-md shadow-md p-6 bg-purple-50"
					>
						<div class="mb-5 w-full">
							<label
								for="message"
								class="block text-sm font-medium text-gray-700"
								>Utilisateur(s)</label
							>
							<select
								v-model="state.selectedUser"
								id="user"
								class="mt-1 p-2 border border-gray-300 rounded-md w-full appearance-none text-gray-700 text-sm"
							>
								<option value="null" selected>
									Tous les utilisateurs connectés
								</option>
								<option
									v-for="user in state.users"
									:key="user._id"
									:value="user._id"
								>
									{{ user.username }}
								</option>
							</select>
						</div>
						<label
							for="message"
							class="block text-sm font-medium text-gray-700 w-full"
							>Message</label
						>
						<textarea
							id="message"
							v-model="state.message"
							placeholder="Entrez votre message ici"
							class="mt-1 p-2 border border-gray-300 rounded-md w-full text-sm text-gray-700"
						></textarea>

						<button
							class="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
							@click="sendNotification"
						>
							Envoyer la notification
						</button>
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
