<template>
  <RouterView />
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import io from 'socket.io-client';
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();
const currentUser = mainStore.currentUser;

const socket = io("http://localhost:3000");

onMounted(() => {
  socket.emit("usersActifs", currentUser);
	socket.on("usersActifs", (user) => {
		if (user._id === currentUser._id) return;
	});
});

onBeforeUnmount(() => {
	socket.close();
});
</script>
