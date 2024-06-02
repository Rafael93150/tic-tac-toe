<script setup>
import GuestLayout from "@/layouts/GuestLayout.vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "@/utils/axiosInstance";
// import { userSchema } from "@/utils/validations/userSchema";

const state = reactive({
  email: "",
  error: "",
});

const router = useRouter();

const submit = async () => {
  try {
    await axiosInstance.post("/auth/forgot-password", {
      email: state.email,
    });

    router.push("/login?registered=true");
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        state.error = "Erreur lors de l'envoi du mail, veuillez réessayer dans quelques instants.";
        return;
      }
    }
    state.error = error.message;
  }
};
</script>

<template>
  <GuestLayout>
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2
            class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >
            Mot de passe oublié
          </h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">
            Vous avez déjà un compte ?
            {{ " " }}
            <RouterLink
              to="login"
              class="font-semibold text-indigo-500 hover:text-secondary-light"
              >Connectez-vous ici</RouterLink
            >
          </p>
        </div>

        <div>
          <div class="my-5">
            <small
              v-if="state.error && state.error.length"
              class="text-red-600"
              >{{ state.error }}</small
            >
          </div>

          <div>
            <form method="POST" class="space-y-6" @submit.prevent="submit">
              <div>
                <p class="mt-2 text-sm leading-6 text-gray-500 pb-5">
            Veuillez renseigner votre adresse email afin de recevoir un lien de réinitialisation du mot de passe.
          </p>
                <label
                  for="email"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Email</label
                >
                <input
                  id="email"
                  v-model="state.email"
                  type="email"
                  placeholder="exemple@gmail.com"
                  class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover-bg-indigo-500 focus-visible-outline focus-visible-outline-2 focus-visible-outline-offset-2 focus-visible-outline-indigo-600"
                >
                  Envoyer le lien
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>
