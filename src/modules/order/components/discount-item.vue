<template>
	<div class="discount-item" v-if="scope.discountSource">
		<p class="t1">- {{ scope.discountPrice }}</p>
		<p class="t2">{{ doc }}</p>
	</div>

	<span v-else>-</span>
</template>

<script lang="ts" setup name="order-discount-item">
import { type PropType, computed } from "vue";

const props = defineProps({
	scope: {
		type: Object as PropType<Eps.OrderInfoEntity>,
		default: () => ({})
	}
});

const doc = computed(() => {
	const { info, type } = props.scope.discountSource || {};

	switch (type) {
		case 0:
			return `${info.title}（满 ${info.condition.fullAmount} 元减 ${info.amount} 元）`;

		default:
			return "";
	}
});
</script>

<style lang="scss" scoped>
.discount-item {
	text-align: left;

	.t1 {
		color: red;
	}

	.t2 {
		font-size: 12px;
	}
}
</style>
