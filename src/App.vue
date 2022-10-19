<template>
	<div class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
		<SiteNavigation />
		<RouterView class="flex-1" v-slot="{ Component }">
			<Transition name="page">
				<component :is="Component" />
			</Transition>
		</RouterView>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { provide } from "vue";
import SiteNavigation from "./components/Layout/SiteNavigation.vue";

const tempShowByFahrenheit = ref(true);
provide("tempShowByFahrenheit", tempShowByFahrenheit);
</script>

<style>
.page-enter-active {
	transition: 600ms ease all;
}
.page-enter-from {
	opacity: 0;
}
</style>
