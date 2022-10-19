<template>
	<div v-for="city in savedCities" :key="city.id">
		<CityCard :city="city" @click="goToCityView(city)" />
	</div>

	<p v-if="savedCities.length === 0">
		No locations added. To start tracking a location, search in the field above.
	</p>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CityCard from "./CityCard.vue";

const API_KEY = import.meta.env.VITE_WEATHER_KEY;

const savedCities = ref([]);

async function getCities() {
	if (localStorage.getItem("savedCities")) {
		savedCities.value = JSON.parse(localStorage.getItem("savedCities"));

		const requests = [];
		savedCities.value.forEach((city) => {
			requests.push(
				axios.get(
					`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=${API_KEY}&units=imperial`
				)
			);
		});

		const weatherData = await Promise.all(requests);

		// Flicker Delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		weatherData.forEach((value, index) => {
			savedCities.value[index].weather = value.data;
		});
	}
}
await getCities();

const router = useRouter();
function goToCityView(city) {
	router.push({
		name: "cityView",
		params: { state: city.state, city: city.city },
		query: {
			id: city.id,
			lat: city.coords.lat,
			lng: city.coords.lng,
		},
	});
}
</script>
