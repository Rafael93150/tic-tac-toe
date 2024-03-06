<script setup>
import { RouterView } from "vue-router";
import { onBeforeUnmount, onMounted, ref } from "vue";
import io from "socket.io-client";
import { useMainStore } from "@/stores/main";
import { showNotification } from "@/components/modals/notification";

const mainStore = useMainStore();
const currentUser = mainStore.currentUser;

const socket = io("http://localhost:3000");

onMounted(() => {
	socket.emit("userLogged", currentUser);

	socket.on("notification", (message) => {
		showNotification({
			message,
			closingTime: 5000,
		});
	});
});

onBeforeUnmount(() => {
	socket.close();
});
</script>

<template>
	<RouterView />
</template>
