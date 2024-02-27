<script setup lang="ts">
import GameMessage from "@/components/game/GameMessage.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import { useMainStore } from "@/stores/main";
import io from "socket.io-client";
import { computed, reactive } from "vue";
import axiosInstance from "@/utils/axiosInstance";

const mainStore = useMainStore();
const socket = io("http://localhost:3000");

const state = reactive({
	messages: [],
});

const props = defineProps({
	room: {
		type: Object,
		required: true,
	},
});

const currentUser = mainStore.currentUser;

const reversedMessages = computed(() => {
	return state.messages.slice().reverse();
});

axiosInstance.get(`/messages/room/${props.room._id}`).then((response) => {
	state.messages = response.data;
});

socket.on("newMessage", (message) => {
	state.messages.push(message);
});

const handleSendMessage = (message) => {
	socket.emit("newMessage", {
		fromUser: currentUser,
		text: message,
		toRoom: props.room._id,
	});
};
</script>

<template>
	<div
		class="messages-container w-72 bg-purple-50 px-4 border-l border-gray-200 flex flex-col py-5"
	>
		<p class="text-gray-800 text-sm font-semibold mb-2">
			Discutez avec ...
		</p>
		<div class="chat-messages">
			<GameMessage
				v-for="message in reversedMessages"
				:key="message._id"
				:message="message"
			/>
		</div>
		<ChatInput
			@send-message="handleSendMessage"
			:isChatInput="false"
			class="mt-auto"
		/>
	</div>
</template>

<style>
.messages-container {
	height: 100vh;
}
.chat-messages {
	display: flex;
	flex-direction: column-reverse;
	overflow-y: auto;
}
</style>
