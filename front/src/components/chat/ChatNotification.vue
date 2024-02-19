<template>
	<!-- user joining chat notification -->
	<div class="chat-notification">
		<div>
			<div class="p-2 text-gray-400 text-xs font-normal">
				<span>{{ notification.user.username }}</span>
				<span>{{ notification.kind === "connexion" ? " a rejoint le chat" : " a quitté le chat" }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});

const notification = props.item.notification;
console.log(notification.kind);
</script>

<style>
.chat-notification-content-date {
	color: #aaa;
	font-size: 11px;
	margin-left: 10px;
	font-weight: 400;
}
</style>
