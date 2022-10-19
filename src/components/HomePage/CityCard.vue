<template>
	<BaseCard class="cursor-pointer">
		<div class="flex flex-col flex-1">
			<h2 class="text-3xl">{{ city.city }}</h2>
			<h3>{{ city.state }}</h3>
		</div>

		<div class="flex flex-col gap-2">
			<p class="text-3xl self-end">
				{{
					tempShowByFahrenheit
						? `${Math.round(city.weather.main.temp)}℉`
						: `${Math.round(((city.weather.main.temp - 32) * 5) / 9)}℃`
				}}
			</p>
			<div class="flex gap-2">
				<span class="text-xs"
					>H:
					{{
						tempShowByFahrenheit
							? `${Math.round(city.weather.main.temp_max)}℉`
							: `${Math.round(((city.weather.main.temp_max - 32) * 5) / 9)}℃`
					}}</span
				>
				<span class="text-xs"
					>L:
					{{
						tempShowByFahrenheit
							? `${Math.round(city.weather.main.temp_min)}℉`
							: `${Math.round(((city.weather.main.temp_min - 32) * 5) / 9)}℃`
					}}</span
				>
			</div>
		</div>
	</BaseCard>
</template>

<script setup>
import BaseCard from "../BaseUI/BaseCard.vue";
import { inject } from "vue";

const tempShowByFahrenheit = inject("tempShowByFahrenheit");
defineProps({
	city: {
		type: Object,
		default: () => {},
	},
});
</script>
