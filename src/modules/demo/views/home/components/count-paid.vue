<template>
	<div class="count-paid">
		<div class="card">
			<div class="card__header">
				<span class="label">付款笔数</span>
				<span class="value">{{ count.total }}</span>

				<el-icon class="more" @click="router.push('/order/info')">
					<arrow-right-bold />
				</el-icon>
			</div>

			<div class="card__container">
				<v-chart :option="chartOption" autoresize />
			</div>

			<div class="card__footer">
				<span class="label">今日新增</span>
				<span class="value">{{ count.today }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useCool } from "/@/cool";
import { ArrowRightBold } from "@element-plus/icons-vue";

const { service, router } = useCool();

const chartOption = reactive({
	grid: {
		left: "10%",
		top: 0,
		right: "10%",
		bottom: 0
	},
	xAxis: {
		type: "category",
		data: [],
		boundaryGap: false
	},
	yAxis: {
		type: "value",
		splitLine: {
			show: false
		},
		axisTick: {
			show: false
		},
		axisLine: {
			show: false
		},
		axisLabel: {
			show: false
		}
	},
	series: [
		{
			barWidth: 18,
			name: "付款笔数",
			type: "bar",
			data: [],
			itemStyle: {
				color: "#4165d7"
			}
		},
		{
			type: "bar",
			barWidth: 18,
			xAxisIndex: 0,
			barGap: "-100%",
			data: [],
			itemStyle: {
				color: "#f1f1f9"
			},
			zlevel: -1
		}
	]
});

const count = ref({ total: 0, today: 0, week: 0, month: 0, year: 0 });

onMounted(() => {
	service.count.home
		.orderSummary({
			type: "count"
		})
		.then((res) => {
			count.value = res;
		});

	service.count.home
		.orderChart({
			type: "count",
			dayCount: 7
		})
		.then((res) => {
			let max = Math.max(...res.datas);

			if (max < 10) {
				max = 10;
			}

			chartOption.series[0].data = res.datas;
			chartOption.series[1].data = res.datas.map(() => max);
		});
});
</script>

<style lang="scss" scoped>
.count-paid {
	.card {
		.echarts {
			height: 50px;
			width: 100%;
		}

		&__container {
			padding: 0;
		}
	}
}
</style>
