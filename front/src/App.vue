<script setup>
import { RouterView } from "vue-router";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { showNotification } from "@/components/modals/notification";
import socket from "@/config/socket";

const mainStore = useMainStore();
const currentUser = mainStore.currentUser;

onMounted(() => {
	socket.emit("userLogged", currentUser);

	socket.on("notification", (message) => {
		showNotification({
			message,
			closingTime: 5000,
		});
		if (!("Notification" in window)) {
			alert("This browser does not support desktop notification");
		} else if (Notification.permission === "granted") {
			const notification = new Notification(message);
		} else if (Notification.permission !== "denied") {
			Notification.requestPermission().then(function (permission) {
				if (permission === "granted") {
					const notification = new Notification(message);
				}
			});
		}
	});

	socket.on("error", (error) => {
		showNotification({
			type: "error",
			message: error,
			closingTime: 3000,
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
