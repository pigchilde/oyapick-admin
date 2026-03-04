<template>
	<div class="pay-item">
		<el-tag v-if="scope.payType == 0" effect="dark" type="info">未支付</el-tag>
		<el-tag v-else-if="scope.payType == 1" effect="dark" color="#2aae67">微信</el-tag>
		<el-tag v-else-if="scope.payType == 2" effect="dark" color="#1678FF">支付宝</el-tag>

		<p :style="{ marginTop: '5px' }">{{ scope.payTime }}</p>
	</div>
</template>

<script lang="ts" setup name="order-pay-item">
import { type PropType } from "vue";

const props = defineProps({
	scope: {
		type: Object as PropType<Eps.OrderInfoEntity>,
		default: () => ({})
	}
});
</script>
