<template>
<LayoutAuthenticated>
  <div class="container flex flex-col items-center justify-center">
		<div
			class="flex flex-col items-center justify-center w-full max-w-md w-full h-full"
		>
      <h1 class="text-xl font-bold text-indigo-600">Envoyer une notification</h1>
      <div
				class="mt-5 flex flex-col items-center justify-center w-full mt-6 rounded-md bg-white shadow-md p-6 bg-purple-50"
			>
        <label for="message" class="block text-sm font-medium text-gray-700">Message:</label>
        <textarea id="message" v-model="message" class="mt-1 p-2 border border-gray-300 rounded-md w-full"></textarea>
        <div class="mt-10 relative w-full">
          <label for="message" class="block text-sm font-medium text-gray-700">Choisir un utilisateur:</label>
          <select v-model="selectedUser" id="user" class="mt-1 p-2 border border-gray-300 rounded-md w-full appearance-none">
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user }}</option>
            </select>
      </div>
      <button
						class="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
						@click="sendNotification"
					>
          Envoyer la notification
			</button>   
      
      
      </div>
    </div>
  </div>

  </LayoutAuthenticated>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted} from 'vue';
  import { showToast } from "@/utils/toast";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

  const message = ref('');
  const selectedUser = ref('');
  const users = ref([]);

  const fetchConnectedUsers = async () => {
      try {
          const token = localStorage.getItem("token");
          const response = await fetch('http://localhost:3000/notifications/connected-users', {
            headers: { "Authorization" : `Bearer ${token}`}
          });

          if (response) {
            const data = await response.json();
            console.log('data', data);

            data.forEach(user => {
              users.value.push(user.username);
            });

          } else {
            console.error('Failed to fetch connected users');
          }
      } catch (error) {
            console.error('Error fetching connected users:', error);
      }
  };

  onMounted(fetchConnectedUsers);

  const sendNotification = async () => {
    
      if (!message.value) {
          showToast('Veuillez saisir le message de la notification à envoyer !');
          return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3000/notifications/send-notification', {
          method: 'POST',
          headers: { "Authorization": `Bearer ${token}` },
          body: JSON.stringify({
              message: message.value,
              recipient: selectedUser.value
          })
        });

    if (response.ok) {
      message.value = '';
      selectedUser.value = '';

      showToast('Notification envoyée avec succès !');
      
      if ('Notification' in window && Notification.permission === 'granted') {
        // Envoyer une notification via l'API Web Notification
        new Notification('Nouvelle notification', {
          body: message.value
        });
      } else {
        const notificationHTML = `<div class="notification">${message.value}</div>`;
        document.body.insertAdjacentHTML('beforeend', notificationHTML);
      }
    } else {
      console.error('Failed to send notification');
      showToast('Erreur lors de l\'envoi de la notification.');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    showToast('Erreur lors de l\'envoi de la notification.');
  }
};

  </script>
  
  <style scoped></style>
  