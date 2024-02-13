<template>
	<div
		v-if="!editingMessage"
		class="hover:bg-indigo-50 flex p-1 px-2 rounded relative"
		@mouseover="showDropdown = true"
		@mouseleave="showDropdown = false"
	>
		<div>
			<span
				class="text-gray-800 dark:text-gray-200 text-ml font-semibold"
				:style="{
					color: message.fromUser
						? message.fromUser.color
						: '#3f51b5',
				}"
				>{{
					message.fromUser
						? message.fromUser.username
						: "Utilisateur supprimé"
				}}
				{{ message.fromUser?.lastname }}
				<small class="text-gray-400 text-xs ml-3 font-normal">{{
					formatDate(message.createdAt)
				}}</small></span
			>
			<div class="text-gray-800 dark:text-gray-200 text-ml">
				{{ message.text }}
			</div>
		</div>

		<div
			v-if="
				showDropdown && (isCurrentUserMessage() || isCurrentUserAdmin())
			"
			class="dropdown shadow bg-white text-gray-700 text-sm absolute top-1 right-1 border border-indigo-200 rounded px-1 py-px flex flex-row z-50"
		>
			<button
				@click="editMessage"
				class="dropdown-item mr-1 p-1 cursor-pointer border-none bg-transparent"
				title="Modifier le message"
			>
				<PencilIcon class="w-5 h-5" />
			</button>
			<button
				@click="deleteMessage(message._id)"
				class="dropdown-item text-red-400 mr-1"
				title="Supprimer le message"
			>
				<TrashIcon class="w-5 h-5" />
			</button>
		</div>
	</div>
	<div v-else class="relative">
		<input
			class="block w-full p-4 pl-4 focus:outline-none text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
			@keydown.enter="saveEditedMessage"
			v-model="editedMessageText"
			type="text"
		/>
		<button
			@click="saveEditedMessage"
			class="text-white absolute right-2.5 bottom-2.5 bg-gray-300 hover:bg-indigo-800 focus:outline-none font-medium rounded-lg text-sm px-2 py-2"
		>
			<CheckIcon class="w-5 h-5" />
		</button>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useMainStore } from "@/stores/main";
import { showToast } from "@/utils/toast";
import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import formatDate from "@/utils/formatDate";

const mainStore = useMainStore();

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});

const message = props.item.message;

const emit = defineEmits(["delete-message", "edit-message"]);

const editingMessage = ref(false);
const editedMessageText = ref("");
const showDropdown = ref(false);

const isCurrentUserMessage = () => {
	return message.fromUser?._id === mainStore.currentUser?._id;
};
const isCurrentUserAdmin = () => {
	return (
		mainStore.currentUser.role === "admin" ||
		mainStore.currentUser.role === "rh"
	);
};
const deleteMessage = () => {
	emit("delete-message", message._id);
};
const editMessage = () => {
	editingMessage.value = true;
	editedMessageText.value = message.text;
};
const saveEditedMessage = () => {
	emit("edit-message", message._id, editedMessageText.value);
	message.text = editedMessageText.value;
	editingMessage.value = false;
};
</script>
