<script setup>
import { RouterView } from "vue-router";
import NotificationModal from "./components/modals/NotificationModal.vue";
import { ref } from "vue";

const showNotificationModal = ref(false);
</script>

<template>
  <RouterView />
  <NotificationModal v-show="showNotificationModal" :closingTime="3000" :message="'Vous avez reçu cette notification car vous allez bientôt être déconnecté'"/>
</template>
