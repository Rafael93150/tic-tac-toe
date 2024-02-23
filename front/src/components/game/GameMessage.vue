<template>
	<div class="py-0.5">
		<span class="text-gray-800 text-sm font-semibold"
			>{{ message.fromUser.username }}
			<small class="text-gray-400 text-xs ml-1 font-normal">{{
				formatDate(message.createdAt, true)
			}}</small>
		</span>
		<div class="text-gray-800 text-sm">
			{{ message.text }}
		</div>
	</div>
</template>

<script setup>
import formatDate from "@/utils/formatDate";
import { defineProps } from "vue";

const props = defineProps({
	message: {
		type: Object,
		required: true,
	},
});
</script>
