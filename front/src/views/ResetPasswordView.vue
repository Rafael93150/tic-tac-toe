<template>
    <GuestLayout>
        <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <div>
                    <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Réinitialisation du mot de passe
                    </h2>
                    <p class="mt-2 text-sm leading-6 text-gray-500">
                        Vous avez déjà un compte ?
                        {{ " " }}
                        <RouterLink to="login" class="font-semibold text-indigo-500 hover:text-secondary-light">
                            Connectez-vous ici</RouterLink>
                    </p>
                </div>

                <div>
                    <div>
                        <form method="POST" class="space-y-6 mt-8" @submit.prevent="submit">
                            <div>
                                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mot de
                                    passe</label>
                                <input name="password" v-model="state.password" type="password"
                                    class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required />
                            </div>
                            <div>
                                <label for="confirmPassword"
                                    class="block text-sm font-medium leading-6 text-gray-900">Confirmer le mot de
                                    passe</label>
                                <input name="confirmPassword" v-model="state.confirmPassword" type="password"
                                    @blur="checkPasswordsMatch"
                                    class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required />
                            </div>
                            <div>
                                <small v-if="state.error" class="text-red-600">
                                    {{ state.error }}
                                </small>
                            </div>

                            <div>
                                <button type="submit"
                                    class="flex w-full justify-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    :disabled="passwordsMatch.value">
                                    Changer le mot de passe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </GuestLayout>
</template>

<script setup>
import GuestLayout from "@/layouts/GuestLayout.vue";
import { reactive, computed, } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "@/utils/axiosInstance";

const state = reactive({
    password: "",
    confirmPassword: "",
    error: "",
});

const router = useRouter();

// Computed property to check if passwords match
const passwordsMatch = computed(() => {
    return state.password === state.confirmPassword;
});

const checkPasswordsMatch = () => {
    if (state.confirmPassword && !passwordsMatch.value) {
        state.error = "Les mots de passe ne correspondent pas.";
    } else {
        state.error = "";
    }
};

const submit = async () => {
    if (!passwordsMatch.value) {
        state.error = "Les mots de passe ne correspondent pas.";
        return;
    }

    try {
        await axiosInstance.post("/auth/reset-password", {
            newPassword: state.password,
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