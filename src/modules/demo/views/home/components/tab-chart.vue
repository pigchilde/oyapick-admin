<template>
	<div class="tab-chart">
		<div class="tab-chart__header">
			<ul class="tab-chart__tab">
				<li
					v-for="(item, index) in tabs.list"
					:key="index"
					:class="{
						active: item.value == tabs.active
					}"
					@click="tabs.select(item.value)"
				>
					{{ item.label }}
				</li>
			</ul>

			<el-radio-group v-model="tabs.day" border @change="refresh()">
				<el-radio-button :label="7">近7天</el-radio-button>
				<el-radio-button :label="15">近15天</el-radio-button>
				<el-radio-button :label="30">近30天</el-radio-button>
			</el-radio-group>
		</div>

		<div class="tab-chart__container">
			<v-chart :option="chartOption" autoresize />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { useCool } from "/@/cool";

const { service } = useCool();

const tabs = reactive({
	active: "amount",
	day: 7,
	list: [
		{
			label: "销售额",
			value: "amount"
		},
		{
			label: "订单数",
			value: "count"
		},
		{
			label: "用户数",
			value: "user"
		}
	],
	select(value: string) {
		tabs.active = value;
		refresh();
	}
});

const chartOption = reactive({
	grid: {
		top: "40px",
		bottom: "40px",
		right: "20px",
		left: "80px",
		containLabel: true
	},
	xAxis: {
		type: "category",
		data: [] as string[],
		offset: 5,
		axisLine: {
			show: false
		},
		axisTick: {
			show: false
		}
	},
	yAxis: {
		type: "value",
		offset: 20,
		splitLine: {
			show: false
		},
		axisTick: {
			show: false
		},
		axisLine: {
			show: false
		}
	},
	tooltip: {
		trigger: "axis",
		formatter([{ axisValueLabel, value }]: any) {
			const d = tabs.list.find((e) => e.value == tabs.active);
			return `${axisValueLabel}${d?.label}：${value}`;
		},
		axisPointer: {
			show: true,
			status: "shadow",
			z: -1,
			type: "shadow"
		}
	},
	series: [
		{
			type: "line",
			barWidth: 15,
			name: "付款笔数",
			data: [] as number[],
			smooth: true,
			symbol: "circle",
			label: {
				show: true,
				position: "top",
				formatter({ data }: { data: number }) {
					if (data === 0) {
						return "";
					} else {
						return data;
					}
				}
			}
		}
	]
});

function refresh() {
	let req: Promise<{ datas: number[]; dates: string[] }>;

	if (tabs.active == "user") {
		req = service.count.home.userChart({
			dayCount: tabs.day
		});
	} else {
		req = service.count.home.orderChart({
			type: tabs.active,
			dayCount: tabs.day
		});
	}

	req.then((res) => {
		let max = Math.max(...res.datas);

		if (max < 10) {
			max = 10;
		}

		// 数据
		chartOption.series[0].data = res.datas;

		// 日期
		chartOption.xAxis.data = res.dates.map((e: string) => {
			const [_, b, c] = e.split("-");
			return `${b}-${c}`;
		});
	});
}

onMounted(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
.tab-chart {
	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 50px;
		padding: 0 20px;

		ul {
			li {
				list-style: none;
				float: left;
				margin-right: 20px;
				font-size: 15px;
				color: #dbdbdb;
				cursor: pointer;

				&.active {
					color: #000;
					font-weight: bold;
				}
			}
		}
	}

	&__container {
		height: 500px;
		padding: 0 15px;

		.echarts {
			height: 100%;
			width: 100%;
		}
	}
}
</style>
