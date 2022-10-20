<template>
	<teleport to="body">
		<transition name="modal-outer">
			<div
				v-show="modalActive"
				class="absolute w-full bg-black bg-opacity-30 min-h-screen top-0 left-0 flex justify-center px-8 backdrop-blur-[0.15rem]"
				@click.self="$emit('close-modal')"
			>
				<transition name="modal-inner">
					<div
						v-if="modalActive"
						class="pt-4 pb-5 px-6 bg-white self-start mt-32 max-w-screen-md rounded-lg grid gap-2"
					>
						<slot />
						<button
							class="text-white mt-8 bg-weather-primary py-2 px-6 rounded-md hover:bg-opacity-80 duration-300 mx-auto"
							@click="$emit('close-modal')"
						>
							Close
						</button>
					</div>
				</transition>
			</div>
		</transition>
	</teleport>
</template>

<script setup>
defineEmits(["close-modal"]);
defineProps({
	modalActive: {
		type: Boolean,
		default: false,
	},
});
</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
	transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-outer-enter-from,
.modal-outer-leave-to {
	opacity: 0;
}
.modal-inner-enter-active {
	transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.modal-inner-leave-active {
	transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-inner-enter-from {
	opacity: 0;
	transform: scale(0.8);
}
.modal-inner-leave-to {
	transform: scale(0.8);
}
</style>
