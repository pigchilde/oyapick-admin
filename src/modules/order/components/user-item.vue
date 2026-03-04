<template>
	<div class="order-user-item">
		<cl-avatar :src="scope.avatarUrl" :size="36"></cl-avatar>
		<span>{{ scope.nickName }}</span>
	</div>
</template>

<script lang="ts" setup name="order-user-item">
const props = defineProps({
	scope: null
});
</script>

<style lang="scss" scoped>
.order-user-item {
	.cl-avatar {
		margin-bottom: 5px;
	}
}
</style>
