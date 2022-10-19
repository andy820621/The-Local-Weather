<template>
	<BaseCard>
		<div class="flex flex-col flex-1 gap-2">
			<AnimatedPlaceholder class="max-w-[50%]" />
			<AnimatedPlaceholder class="max-w-[40%]" />
		</div>

		<div class="flex flex-col flex-1 gap-2 items-end">
			<AnimatedPlaceholder class="max-w-[50px] w-full" />
			<AnimatedPlaceholder class="max-w-[75px] w-full" />
		</div>
	</BaseCard>
</template>

<script setup>
import BaseCard from "../BaseUI/BaseCard.vue";
import AnimatedPlaceholder from "../BaseUI/AnimatedPlaceholder.vue";
</script>
