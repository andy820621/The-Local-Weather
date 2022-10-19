<template>
	<main class="container text-white">
		<div class="pt-4 mb-8 relative">
			<input
				type="text"
				placeholder="Search for a city or state"
				class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
				v-model.trim="searchQuery"
				@input="getSearchResult"
				autocomplete="nope"
			/>

			<ul
				class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
				v-if="maxboxSearchResults"
			>
				<p v-if="serverError">Sorry, somthing went wrong, please try again.</p>
				<p v-if="!serverError && maxboxSearchResults.length === 0">
					No results match your query, try a different term.
				</p>
				<template v-else>
					<li
						v-for="searchResult in maxboxSearchResults"
						:key="searchResult.id"
						class="py-2 cursor-pointer"
						@click="previewCity(searchResult)"
					>
						{{ searchResult.place_name }}
					</li>
				</template>
			</ul>
		</div>

		<div class="flex flex-col gap-4">
			<Suspense>
				<CityList />
				<template #fallback>
					<CityCardSkeleton v-for="item in getCardCount" :key="item" />
				</template>
			</Suspense>
		</div>
	</main>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import CityList from "../components/HomePage/CityList.vue";
import CityCardSkeleton from "../components/HomePage/CityCardSkeleton.vue";

const API_KEY = import.meta.env.VITE_GEO_KEY;

const searchQuery = ref("");
const queryTimout = ref(null);
const maxboxSearchResults = ref(null);
const serverError = ref(null);

function getSearchResult() {
	clearTimeout(queryTimout.value);
	queryTimout.value = setTimeout(async () => {
		if (searchQuery.value !== "") {
			try {
				const result = await axios.get(
					`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${API_KEY}&types=place`
				);
				maxboxSearchResults.value = result.data.features;
			} catch {
				serverError.value = true;
			}
			return;
		}
		maxboxSearchResults.value = null;
	}, 800);
}

const router = useRouter();

function previewCity(searchResult) {
	const positionDetail = searchResult.context;
	const cityEng = searchResult.text;
	const cityOriginal = positionDetail.filter((item) =>
		item.id.includes("region")
	)[0].text;
	const country = positionDetail.filter((item) =>
		item.id.includes("country")
	)[0]?.text;

	const [city, state] = searchResult.place_name.split(",");
	router.push({
		name: "cityView",
		params: {
			state: country ? `${cityOriginal}, ${country}` : cityOriginal,
			city: cityEng,
		},
		query: {
			lat: searchResult.geometry.coordinates[1],
			lng: searchResult.geometry.coordinates[0],
			preview: true,
		},
	});
}

const getCardCount = computed(
	() => JSON.parse(localStorage.getItem("savedCities"))?.length
);
</script>
