import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "@/utils/auth";

const routes = [
	{
		meta: {
			title: "Chat",
		},
		path: "/chat",
		name: "chat",
		component: () => import("@/views/ChatView.vue"),
	},
	{
		meta: {
			title: "Profil",
		},
		path: "/profile",
		name: "profile",
		component: () => import("@/views/ProfileView.vue"),
	},
	{
		meta: {
			title: "Connexion",
		},
		path: "/login",
		name: "login",
		component: () => import("@/views/LoginView.vue"),
	},
	{
		meta: {
			title: "Inscription",
		},
		path: "/register",
		name: "register",
		component: () => import("@/views/RegisterView.vue"),
	},
	{
		meta: {
			title: "Mot de passe oublié",
		},
		path: "/forgot-password",
		name: "forgot-password",
		component: () => import("@/views/ForgotPasswordView.vue"),
	},
	{
		meta: {
			title: "Réinitialisation du mot de passe",
		},
		path: "/reset-password",
		name: "reset-password",
		component: () => import("@/views/ResetPasswordView.vue"),
	},
	{
		meta: {
			title: "Morpion",
		},
		path: "/",
		name: "home",
		component: () => import("@/views/TicTacToeView.vue"),
	},
	{
		meta: {
			title: "Morpion",
		},
		path: "/game/:gameId?",
		name: "tic-tac-toe",
		component: () => import("@/views/TicTacToeView.vue"),
	},
	{
		meta: {
			title: "Notifications",
		},
		path: "/notifications",
		name: "notifications",
		component: () => import("@/views/NotificationView.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		return savedPosition || { top: 0 };
	},
});

router.beforeEach((to, from, next) => {
	if (to.name === 'reset-password') {
		const { email, token } = to.query;
		if (!email || !token) {
			next({ name: 'login' });
		} else {
			next();
		}
	} else if (to.path !== "/login" && to.path !== "/register" && to.path !== "/forgot-password" && !isAuthenticated()) {
		next({ name: "login" });
	} else {
		next();
	}
});


export default router;
