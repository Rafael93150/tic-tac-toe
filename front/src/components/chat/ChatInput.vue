<script setup>
import {
	EllipsisVerticalIcon,
	PaperAirplaneIcon,
} from "@heroicons/vue/24/outline";
import { ref, defineProps, defineEmits } from "vue";

const emit = defineEmits(["send-message"]);
const props = defineProps({
	isGlobalChat: {
		type: Boolean,
		default: true,
	},
});

let message = ref("");
const openPersonalMessageModal = ref(false);

const sendMessage = () => {
	if (message.value.trim() !== "") {
		emit("send-message", message.value);
		message.value = "";
	}
};

const predefinedMessages = ["Salut!", "Ça va?", "Merci!", "À plus tard!"];

const choosePredefinedMessage = (selectedMessage) => {
	message.value = selectedMessage;
	openPersonalMessageModal.value = false;
	sendMessage();
};
</script>

<template>
	<div class="relative chat-input mt-3">
		<div
			class="absolute inset-y-0 left-0 flex items-center pointer-events-none"
			:class="props.isGlobalChat ? 'pl-4' : 'pl-3'"
		>
			<PaperAirplaneIcon
				class="text-gray-400"
				:class="props.isGlobalChat ? 'w-5 h-5' : 'w-4 h-4'"
				aria-hidden="true"
			/>
		</div>
		<input
			v-model="message"
			@keydown.enter="sendMessage"
			type="search"
			id="search"
			class="block w-full text-gray-900 border border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
			:class="
				props.isGlobalChat
					? 'p-4 pl-12 text-sm rounded-lg'
					: 'p-3 pl-9 text-xs rounded-md'
			"
			placeholder="Ecrivez ici votre message..."
			required
		/>
		<!-- bouton qui ouvre une modal pour choisir un message prédéfini -->
		<div class="absolute right-2 top-2">
			<div class="relative">
				<button
					@click="
						openPersonalMessageModal = !openPersonalMessageModal
					"
					class="text-gray-400 hover:text-gray-600 focus:outline-none rounded-lg hover:bg-gray-100"
					:class="
						props.isGlobalChat
							? 'text-sm px-1 py-2'
							: 'text-xs px-0.5 py-1'"
				>
					<EllipsisVerticalIcon :class="props.isGlobalChat ? 'w-6 h-6' : 'w-5 h-5'" />
				</button>
				<div
					v-if="openPersonalMessageModal"
					:class="
						props.isGlobalChat
							? 'absolute bottom-10 right-0'
							: 'absolute bottom-8 right-0'
					"
					class="bg-white shadow-lg rounded-lg p-1 w-40"
				>
					<p
						v-for="message in predefinedMessages"
						:key="message"
						@click="choosePredefinedMessage(message)"
						class="text-gray-600 bg-purple-50 cursor-pointer my-1 hover:bg-purple-100"
						:class="props.isGlobalChat ? 'px-2 py-1 text-sm rounded-lg' : 'px-1 py-0.5 text-xs rounded-md'"
					>
						{{ message }}
					</p>
				</div>
			</div>
		</div>

		<!-- <button
			v-if="props.isGlobalChat"
			@click="sendMessage"
			class="text-white absolute right-2.5 bottom-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2"
		>
			Envoyer
		</button> -->
	</div>
</template>
