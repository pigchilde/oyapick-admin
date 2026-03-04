<template>
	<div class="count-effect">
		<div class="card">
			<div class="card__header">
				<span class="label">总销售额</span>
				<span class="value">{{ count.total }}</span>

				<el-icon class="more" @click="router.push('/order/info')">
					<arrow-right-bold />
				</el-icon>
			</div>

			<div class="card__container">
				<ul class="count-effect__cop">
					<li>
						<span>周</span>
						<span>{{ count.week }}</span>
					</li>

					<li>
						<span>月</span>
						<span>{{ count.month }}</span>
					</li>

					<li>
						<span>年</span>
						<span>{{ count.year }}</span>
					</li>
				</ul>
			</div>

			<div class="card__footer">
				<span class="label">日销售</span>
				<span class="value">{{ count.today }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useCool } from "/@/cool";
import { ArrowRightBold } from "@element-plus/icons-vue";

const { service, router } = useCool();

const count = ref({ total: 0, today: 0, week: 0, month: 0, year: 0 });

onMounted(() => {
	service.count.home
		.orderSummary({
			type: "amount"
		})
		.then((res) => {
			console.log(res);
			count.value = res;
		});
});
</script>

<style lang="scss" scoped>
.count-effect {
	.card__header {
		.value {
			&::after {
				content: "元";
				font-size: 12px;
				margin-left: 4px;
			}
		}
	}

	&__cop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;

		li {
			display: flex;
			flex-direction: column;
			justify-content: center;
			list-style: none;
			flex: 1;

			span {
				&:first-child {
					font-size: 12px;
					color: #999;
				}

				&:last-child {
					font-size: 14px;
					margin: 5px 0;
				}
			}
		}
	}
}
</style>
