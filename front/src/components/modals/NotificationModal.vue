<template>
	<transition name="fade-in">
		<div
			class="modal bg-white rounded-lg shadow-lg fixed top-5 right-5 z-50 border flex flex-col max-w-sm min-w-60"
		>
			<div class="flex flex-row items-center justify-start p-2">
				<InformationCircleIcon
					class="h-5 w-5"
					:class="{
						'text-indigo-600': props.type === 'info',
						'text-red-500': props.type === 'error',
					}"
				/>
				<h1
					class="text-base ml-2"
					:class="{
						'text-indigo-600': props.type === 'info',
						'text-red-500': props.type === 'error',
					}"
				>
					{{ props.type === "info" ? "Notification" : "Erreur" }}
				</h1>
				<button
					v-if="props.showCloseButton"
					@click="emit('close')"
					class="p-1 hover:bg-gray-100 rounded-full ml-auto"
				>
					<XMarkIcon class="h-5 w-5 text-gray-500" />
				</button>
			</div>
			<hr />
			<p class="text-sm ml-2 text-gray-500 text-sm px-2 py-2 mr-2">
				{{ message }}
			</p>
			<div
				class="timer h-1 rounded-b-lg w-full" :class="{
					'bg-indigo-600': props.type === 'info',
					'bg-red-500': props.type === 'error',
				}"
				:style="{ transition: `width ${props.closingTime}ms linear` }"
			></div>
		</div>
	</transition>
</template>

<script setup>
import { InformationCircleIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { defineProps, defineEmits, ref } from "vue";
const props = defineProps({
	type: {
		type: String,
		default: "info",
	},
	message: {
		type: String,
		default: "Vous avez reçu une notification",
	},
	showCloseButton: {
		type: Boolean,
		default: true,
	},
	closingTime: {
		type: Number,
		default: 5000,
	},
});

const message = ref(props.message || "Vous avez reçu une notification");
setTimeout(() => {
	document.querySelector(".timer").classList.add("reduce");
}, 100);

const emit = defineEmits(["close"]);
</script>

<style>
.fade-in-enter-active {
	transition: opacity 0.5s;
}
.fade-in-leave-active {
	transition: opacity 0.5s;
}
.fade-in-enter,
.fade-in-leave-to {
	opacity: 0;
}

.timer.reduce {
	width: 0;
}
</style>
