<script setup lang="ts">
import ChatInput from "@/components/chat/ChatInput.vue";
import ChatMessage from "@/components/chat/ChatMessage.vue";
import ChatNotification from "@/components/chat/ChatNotification.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import axiosInstance from "@/utils/axiosInstance";
import { onMounted, reactive, watchEffect } from "vue";
import { useMainStore } from "@/stores/main";
import io from "socket.io-client";

const mainStore = useMainStore();
const socket = io("http://localhost:3000");

const state = reactive({
	messages: [] as {
		_id: string;
		text: string;
		fromUser: any;
		createdAt: string;
	}[],
	notifications: [] as { kind: string; user: any; date: string }[],
	items: [] as { message: any; notification: any; date: string }[],
});

watchEffect(() => {
	state.items = state.messages.map((message) => {
		return { message, notification: null, date: message.createdAt };
	});
	state.notifications.forEach((notification) => {
		state.items.push({
			message: null,
			notification,
			date: notification.date,
		});
	});
	state.items.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
});

axiosInstance.get("/messages/populated").then((response) => {
	state.messages = response.data;
});

const handleSendMessage = (message) => {
	socket.emit("newMessage", {
		fromUser: mainStore.currentUser,
		text: message,
	});
};

const deleteMessage = async (messageId) => {
	try {
		socket.emit("deleteMessage", messageId);
	} catch (error) {
		console.error(error);
	}
};

const saveEditedMessage = async (messageId, messageText) => {
	try {
		if (messageText.trim() === "") {
			socket.emit("deleteMessage", messageId);
		} else {
			socket.emit("editMessage", messageId, messageText);
		}
	} catch (error) {
		console.error(error);
	}
};

onMounted(() => {
	const currentUser = mainStore.currentUser;
	socket.emit("joinChat", currentUser);
	socket.on("joinChat", (user) => {
		state.notifications.push({
			kind: "connexion",
			user,
			date: new Date().toISOString(),
		});
	});
	socket.on("newMessage", (message) => {
		state.messages.unshift(message);
	});
	socket.on("deleteMessage", (messageId) => {
		state.messages = state.messages.filter(
			(message) => message._id.toString() !== messageId.toString()
		);
	});
	socket.on("editMessage", (messageId, newText) => {
		state.messages = state.messages.map((message) => {
			if (message._id.toString() === messageId.toString()) {
				message.text = newText;
			}
			return message;
		});
	});
});
</script>

<template>
	<LayoutAuthenticated>
		<div class="chat">
			<div class="chat-messages">
				<component
					v-for="(item, index) in state.items"
					:key="index"
					:is="item.message ? ChatMessage : ChatNotification"
					:item="item"
					@delete-message="deleteMessage"
					@edit-message="saveEditedMessage"
				/>
			</div>
			<ChatInput @send-message="handleSendMessage" />
		</div>
	</LayoutAuthenticated>
</template>

<style>
.chat-messages {
	display: flex;
	flex-direction: column-reverse;
	height: calc(100vh - 150px);
	overflow-y: scroll;
}
</style>
