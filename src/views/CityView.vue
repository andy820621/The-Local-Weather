<template>
	<div>
		<Suspense>
			<AsyncCityView />
			<template #fallback>
				<CityViewSkeleton />
			</template>
		</Suspense>
	</div>
</template>

<script setup>
import AsyncCityView from "../components/WeatherPage/AsyncCityView.vue";
import CityViewSkeleton from "../components/WeatherPage/CityViewSkeleton.vue";
</script>
