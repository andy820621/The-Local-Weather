<template>
	<div class="flex flex-col flex-1 items-center">
		<!-- Banner -->
		<div
			v-if="route.query.preview"
			class="text-white p-4 bg-weather-secondary w-full text-center"
		>
			<p>
				You are currently previewing this city, click the "+" icon to start
				tracking this city.
			</p>
		</div>
		<!-- Weather Overview -->
		<section class="flex flex-col items-center text-white py-12">
			<h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
			<h2 class="text-lg mb-2">{{ route.params.state }}</h2>
			<p class="text-sm mb-12">
				{{
					new Date(weatherData.currentTime).toLocaleDateString("en-us", {
						weekday: "short",
						day: "2-digit",
						month: "long",
					})
				}}
				{{
					new Date(weatherData.currentTime).toLocaleTimeString("en-us", {
						timeStyle: "short",
					})
				}}
			</p>
			<p class="text-8xl mb-8">
				{{
					tempShowByFahrenheit
						? `${Math.round(weatherData.current.temp)}℉`
						: `${Math.round(((weatherData.current.temp - 32) * 5) / 9)}℃`
				}}
			</p>
			<p>
				Feels like
				{{
					tempShowByFahrenheit
						? `${Math.round(weatherData.current.feels_like)}℉`
						: `${Math.round(((weatherData.current.feels_like - 32) * 5) / 9)}℃`
				}}
			</p>
			<p class="capitalize">
				{{ weatherData.current.weather[0].description }}
			</p>
			<img
				class="w-[150px] h-auto"
				:src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
				alt="weather image"
			/>
		</section>

		<hr class="border-white border-opacity-10 border w-full" />

		<!-- Hourly Weather -->
		<section class="max-w-screen-md w-full py-12">
			<div class="mx-8 text-white">
				<h2 class="mb-4">Hourly Weather</h2>
				<ul class="flex gap-10 overflow-x-scroll list-none">
					<li
						v-for="hourData in weatherData.hourly"
						:key="hourData.dt"
						class="flex flex-col gap-4 items-center"
					>
						<p class="whitespace-nowrap text-md">
							{{
								new Date(hourData.currentTime).toLocaleTimeString("en-us", {
									hour: "numeric",
								})
							}}
						</p>
						<img
							class="w-auto h-[50px] object-cover"
							:src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
							alt="weather image"
						/>
						<p class="text-xl">
							{{
								tempShowByFahrenheit
									? `${Math.round(hourData.temp)}℉`
									: `${Math.round(((hourData.temp - 32) * 5) / 9)}℃`
							}}
						</p>
					</li>
				</ul>
			</div>
		</section>

		<hr class="border-white border-opacity-10 border w-full" />

		<!-- Weekly Weather -->
		<section class="max-w-screen-md w-full py-12">
			<ul class="mx-8 text-white list-none">
				<h2 class="mb-4">7 Day Forecast</h2>
				<li
					v-for="day in weatherData.daily"
					:key="day.dt"
					class="flex items-center"
				>
					<p class="flex-1">
						{{
							new Date(day.dt * 1000).toLocaleDateString("en-us", {
								weekday: "long",
							})
						}}
					</p>
					<img
						class="w-[50px] h-[50px] object-cover"
						:src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
						alt="weather image"
					/>
					<div class="flex gap-2 flex-1 justify-end">
						<p>
							H:
							{{
								tempShowByFahrenheit
									? `${Math.round(day.temp.max)}℉`
									: `${Math.round(((day.temp.max - 32) * 5) / 9)}℃`
							}}
						</p>
						<p>
							L:
							{{
								tempShowByFahrenheit
									? `${Math.round(day.temp.min)}℉`
									: `${Math.round(((day.temp.min - 32) * 5) / 9)}℃`
							}}
						</p>
					</div>
				</li>
			</ul>
		</section>

		<div
			class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150"
			:class="{
				'hover:text-red-500': route.query.id,
				'hover:text-weather-secondary': !route.query.id,
			}"
			@click="removeCity"
		>
			<i class="fa-solid fa-trash" v-if="route.query.id"></i>
			<i class="fa-solid fa-arrow-left" v-else></i>
			<p>{{ route.query.id ? "Remove City" : "Back to List" }}</p>
		</div>
	</div>
</template>

<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { inject } from "vue";

const tempShowByFahrenheit = inject("tempShowByFahrenheit");

const route = useRoute();
const API_KEY = import.meta.env.VITE_WEATHER_KEY;

async function getWeatherData() {
	try {
		const weatherData = await axios.get(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lng}&exclude={part}&appid=${API_KEY}&units=imperial`
		);

		// calculate current date & time
		const localOffset = new Date().getTimezoneOffset() * 60000;
		const utc = weatherData.data.current.dt * 1000 + localOffset;
		weatherData.data.currentTime =
			utc + 1000 * weatherData.data.timezone_offset;

		// calculate hourly weather offset
		weatherData.data.hourly.forEach((hour) => {
			const utc = hour.dt * 1000 + localOffset;
			hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
		});

		// Flicker Delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		return weatherData.data;
	} catch (err) {
		console.log(err);
	}
}

const weatherData = await getWeatherData();

const router = useRouter();
function removeCity() {
	if (route.query.id) {
		const cities = JSON.parse(localStorage.getItem("savedCities"));
		const updatedCities = cities.filter((city) => city.id !== route.query.id);
		localStorage.setItem("savedCities", JSON.stringify(updatedCities));
	}

	router.push({
		name: "home",
	});
}
</script>
