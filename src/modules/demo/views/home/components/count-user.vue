<template>
	<div class="count-sales">
		<div class="card">
			<div class="card__header">
				<span class="label">总用户数</span>
				<span class="value">{{ count.total }}</span>

				<el-icon class="more" @click="router.push('/user/list')">
					<arrow-right-bold />
				</el-icon>
			</div>

			<div class="card__container">
				<ul class="count-sales__cop">
					<li>
						<span>周新增：</span>
						<span>{{ count.week }}</span>
					</li>

					<li>
						<span>月新增：</span>
						<span>{{ count.month }}</span>
					</li>

					<li>
						<span>年新增：</span>
						<span>{{ count.year }}</span>
					</li>
				</ul>
			</div>

			<div class="card__footer">
				<span class="label">日增用户数</span>
				<span class="value">{{ count.today }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useCool } from "/@/cool";
import { onMounted, ref } from "vue";
import { ArrowRightBold } from "@element-plus/icons-vue";

const { service, router } = useCool();

const count = ref({
	month: 0,
	today: 0,
	total: 0,
	week: 0,
	year: 0
});

onMounted(() => {
	service.count.home.userSummary().then((res) => {
		count.value = res;
	});
});
</script>

<style lang="scss" scoped>
.count-sales {
	&__cop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;

		li {
			display: flex;
			align-items: center;
			list-style: none;
			flex: 1;

			span {
				&:first-child {
					color: #ccc;
				}
			}
		}
	}
}
</style>
