<script setup lang="ts">
import ChatInput from "@/components/chat/ChatInput.vue";
import ChatMessage from "@/components/chat/ChatMessage.vue";
import ChatNotification from "@/components/chat/ChatNotification.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import axiosInstance from "@/utils/axiosInstance";
import { computed, onBeforeUnmount, onMounted, reactive } from "vue";
import { useMainStore } from "@/stores/main";
import socket from "@/config/socket";

const mainStore = useMainStore();

const state = reactive({
	items: [] as { message: any; notification: any }[],
});

const reversedItems = computed(() => {
	return state.items.slice().reverse();
});

axiosInstance.get("/messages/").then((response) => {
	state.items = response.data.map((message) => ({
		message,
		notification: null,
		date: message.createdAt,
	}));
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

const currentUser = mainStore.currentUser;

onMounted(() => {
	socket.emit("joinChat", currentUser);

	socket.on("joinChat", (user) => {
		if (user._id === currentUser._id) return;
		state.items.push({
			message: null,
			notification: {
				kind: "connexion",
				user,
				date: new Date().toISOString(),
			},
		});
	});

	socket.on("newMessage", (message) => {
		state.items.push({
			message,
			notification: null,
		});
	});

	socket.on("deleteMessage", (messageId) => {
		state.items = state.items.filter((item) => {
			if (item.message?._id.toString() === messageId.toString()) {
				return false;
			}
			return true;
		});
	});

	socket.on("editMessage", (messageId, newText) => {
		state.items = state.items.map((item) => {
			if (item.message?._id.toString() === messageId.toString()) {
				item.message.text = newText;
			}
			return item;
		});
	});

	socket.on("leaveChat", (user) => {
		if (user._id === currentUser._id) return;
		state.items.push({
			message: null,
			notification: {
				kind: "deconnexion",
				user,
				date: new Date().toISOString(),
			},
		});
	});
});

onBeforeUnmount(() => {
	socket.close();
});
</script>

<template>
	<LayoutAuthenticated>
		<div class="messages-container px-4 sm:px-6 lg:px-8 flex flex-col py-4">
			<div class="chat-messages">
				<component
					v-for="item in reversedItems"
					:key="item.message?._id || item.notification?.date"
					:is="item.message ? ChatMessage : ChatNotification"
					:item="item"
					@delete-message="deleteMessage"
					@edit-message="saveEditedMessage"
				/>
			</div>
			<ChatInput @send-message="handleSendMessage" class="mt-auto" />
		</div>
	</LayoutAuthenticated>
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
