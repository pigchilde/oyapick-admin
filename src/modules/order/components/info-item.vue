<template>
	<div class="info-item">
		<p>标题：{{ scope.title }}</p>
		<p>单号：{{ scope.orderNum }}</p>
	</div>
</template>

<script lang="ts" setup name="order-info-item">
import { type PropType } from "vue";

const props = defineProps({
	scope: {
		type: Object as PropType<Eps.OrderInfoEntity>,
		default: () => ({})
	}
});
</script>

<style lang="scss" scoped>
.info-item {
	text-align: left;
	font-size: 12px;
}
</style>
