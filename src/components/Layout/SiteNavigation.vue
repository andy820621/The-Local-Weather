<template>
	<header class="sticky top-0 bg-weather-primary shadow-lg">
		<nav
			class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6"
		>
			<RouterLink :to="{ name: 'home' }">
				<div class="flex items-center gap-3">
					<i class="fa-solid fa-sun text-2xl"></i>
					<p class="text-2xl">The Local Weather</p>
				</div>
			</RouterLink>

			<div
				class="flex gap-3 flex-1 justify-end [&>*]:text-xl [&>*:hover]:text-weather-secondary [&>*]:duration-150 [&>*]:cursor-pointer [&>*:active]:translate-y-1"
			>
				<i class="fa-solid fa-circle-info" @click="toggleModal"></i>
				<i
					class="fa-solid fa-plus"
					@click="addCity"
					v-if="route.query && route.query.preview"
				></i>
				<button @click="changeTempDisplay">
					<p
						class="text-xl font-bold translate-y-[1px]"
						v-if="tempShowByFahrenheit"
					>
						℉
					</p>
					<p class="text-xl font-bold translate-y-[1px]" v-else>℃</p>
				</button>
			</div>

			<BaseModal :modal-active="modalActive" @close-modal="toggleModal">
				<div class="text-black">
					<h1 class="text-2xl mb-1">About:</h1>
					<p class="mb-4">
						The Local Weather allows you to track the current and future weather
						of cities of your choosing.
					</p>
					<h2 class="text-2xl">How it works:</h2>
					<ol class="list-decimal list-inside mb-4">
						<li>
							Search for your city by entering the name into the search bar.
						</li>
						<li>
							Select a city within the results, this will take you to the
							current weather for your selection.
						</li>
						<li>
							Track the city by clicking on the "+" icon in the top right. This
							will save the city to view at a later time on the home page.
						</li>
					</ol>

					<h2 class="text-2xl">Removing a city</h2>
					<p>
						If you no longer wish to track a city, simply select the city within
						the home page. At the bottom of the page, there will be am option to
						delete the city.
					</p>
				</div>
			</BaseModal>
			<BaseModal :modal-active="alertExist" @close-modal="toggleExist">
				<div class="text-black">This city is already on the list.</div>
			</BaseModal>
		</nav>
	</header>
</template>

<script setup>
import { ref } from "vue";
import { uid } from "uid";
import BaseModal from "../BaseUI/BaseModal.vue";
import { useRoute, useRouter } from "vue-router";
import { inject } from "vue";

const tempShowByFahrenheit = inject("tempShowByFahrenheit");
function changeTempDisplay() {
	tempShowByFahrenheit.value = !tempShowByFahrenheit.value;
}

const route = useRoute();
const router = useRouter();

const modalActive = ref(false);
const alertExist = ref(false);

function toggleModal() {
	document.body.style.overflow = modalActive.value ? "initial" : "hidden";
	modalActive.value = !modalActive.value;
}
function toggleExist() {
	document.body.style.overflow = alertExist.value ? "initial" : "hidden";
	alertExist.value = !alertExist.value;
}

const savedCities = ref([]);

function addCity() {
	if (localStorage.getItem("savedCities")) {
		savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
	}
	if (savedCities.value.some((city) => city.city === route.params.city)) {
		toggleExist();
		let query = Object.assign({}, route.query);
		delete query.preview;
		router.replace({ query });

		return;
	}

	const locationObj = {
		id: uid(),
		state: route.params.state,
		city: route.params.city,
		coords: {
			lat: route.query.lat,
			lng: route.query.lng,
		},
	};

	savedCities.value.push(locationObj);
	localStorage.setItem("savedCities", JSON.stringify(savedCities.value));

	let query = Object.assign({}, route.query);
	delete query.preview;
	query.id = locationObj.id;
	router.replace({ query });
}
</script>
