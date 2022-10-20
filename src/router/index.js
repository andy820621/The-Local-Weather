import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
			meta: {
				title: "Home",
			},
		},
		{
			path: "/weather/:state/:city",
			name: "cityView",
			component: () => import("@/views/CityView.vue"),
			meta: {
				title: "Weather",
			},
		},
		{
			path: "/:pathMatch(.*)*",
			component: () => import("@/views/NotFound.vue"),
		},
	],
});

router.beforeEach((to, from, next) => {
	document.title = `${
		to.params.state ? to.params.city : to.meta.title
	} | The Local Weather`;
	next();
});

export default router;
