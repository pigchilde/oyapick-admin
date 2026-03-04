<template>
	<div class="remark-item">
		<p v-if="scope.remark">用户下单：{{ scope.remark }}</p>
		<p v-if="scope.closeRemark">取消订单：{{ scope.closeRemark }}</p>
		<p v-if="scope.refund?.refuseReason">拒绝退款：{{ scope.refund?.refuseReason }}</p>
		<p v-if="scope.refund?.reason">申请退款：{{ scope.refund?.reason }}</p>
	</div>
</template>

<script lang="ts" setup name="order-remark-item">
import { type PropType } from "vue";

const props = defineProps({
	scope: {
		type: Object as PropType<Eps.OrderInfoEntity>,
		default: () => ({})
	}
});
</script>

<style lang="scss" scoped>
.remark-item {
	text-align: left;
	font-size: 12px;
}
</style>
