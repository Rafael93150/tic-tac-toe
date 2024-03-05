<script setup>
import { InformationCircleIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
	message: String,
	closingTime: Number,
	showCloseButton: {
		type: Boolean,
		default: true,
	},
	closeOnOutsideClick: {
		type: Boolean,
		default: false,
	},
});

const open = ref(true);

const closeModal = () => {
	open.value = false;
};

onMounted(() => {
	if (props.closingTime) {
		setTimeout(() => {
			closeModal();
		}, props.closingTime);
	}
	if (props.closeOnOutsideClick)
		document.addEventListener("click", handleClickOutside);
});

const handleClickOutside = (event) => {
	if (!event.target.closest(".modal")) {
		closeModal();
	}
};

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
	<transition name="fade-in">
		<div
			v-show="open"
			class="modal bg-white rounded-lg shadow-lg fixed top-5 right-5 z-50 border flex flex-col max-w-sm"
			ref="modal"
		>
			<div class="flex flex-row items-center justify-start p-2">
				<InformationCircleIcon class="h-5 w-5 text-indigo-600 ml-1" />
				<h1 class="text-base text-indigo-600 ml-2">Notification</h1>
				<button
					v-if="props.showCloseButton"
					@click="closeModal"
					class="p-1 hover:bg-gray-100 rounded-full ml-auto"
				>
					<XMarkIcon class="h-5 w-5 text-gray-500" />
				</button>
			</div>
			<hr />
			<p class="text-sm ml-2 text-gray-500 text-sm px-2 py-2">
				{{ message }}
			</p>
		</div>
	</transition>
</template>

<style>
.fade-in-enter-active {
	transition: opacity 0.5s;
}
.fade-in-leave-active {
	transition: opacity 0.5s;
}
.fade-in-enter, .fade-in-leave-to {
	opacity: 0;
}
</style>
