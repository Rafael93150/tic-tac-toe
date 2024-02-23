<script setup>
import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, defineEmits } from "vue";

const emit = defineEmits(["send-message"]);
const props = defineProps({
  isChatInput: {
	type: Boolean,
	default: true
  }
});

let message = ref("");

const sendMessage = () => {
	if (message.value.trim() !== "") {
		emit("send-message", message.value);
		message.value = "";
	}
};
</script>

<template>
	<div class="relative chat-input mt-3">
		<div
			class="absolute inset-y-0 left-0 flex items-center pointer-events-none"
			:class="props.isChatInput ? 'pl-4' : 'pl-3'"
		>
			<PaperAirplaneIcon
				class="text-gray-400"
				:class="props.isChatInput ? 'w-5 h-5' : 'w-4 h-4'"
				aria-hidden="true"
			/>
		</div>
		<input
			v-model="message"
			@keydown.enter="sendMessage"
			type="search"
			id="search"
			class="block w-full text-gray-900 border border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
			:class="props.isChatInput ? 'p-4 pl-12 text-sm rounded-lg' : 'p-3 pl-9 text-xs rounded-md'"
			placeholder="Ecrivez ici votre message..."
			required
		/>
		<button
			v-if="props.isChatInput"
			@click="sendMessage"
			class="text-white absolute right-2.5 bottom-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2"
		>
			Envoyer
		</button>
	</div>
</template>
