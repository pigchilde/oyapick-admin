<template>
	<div class="category-ratio">
		<div class="card">
			<div class="card__header">
				<span class="label">销售类别占比</span>

				<el-icon class="more" @click="router.push('/goods/category')">
					<arrow-right-bold />
				</el-icon>
			</div>

			<div class="card__container">
				<v-chart :option="chartOption" autoresize />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useCool } from "/@/cool";
import { ArrowRightBold } from "@element-plus/icons-vue";
import { orderBy } from "lodash-es";

const { service, router } = useCool();

const list = ref<{ typeName: string; total: number }[]>([]);

const chartOption = reactive({
	legend: {
		top: 50,
		left: 15,
		orient: "vertical",
		icon: "circle",
		data: [] as string[],
		formatter(name: string) {
			const d = list.value.find((e) => e.typeName === name);

			return `${d?.typeName}（${d?.total}）`;
		}
	},

	series: [
		{
			type: "pie",
			padAngle: 5,
			radius: ["45%", "60%"],
			center: ["75%", "55%"],
			avoidLabelOverlap: false,
			label: {
				show: false,
				position: "center"
			},
			emphasis: {
				label: {
					show: true,
					fontSize: "15",
					fontWeight: "bold"
				}
			},
			labelLine: {
				show: false
			},
			data: [] as any[],
			itemStyle: {
				borderColor: "#fff",
				borderWidth: 2,
				borderRadius: 4
			}
		}
	]
});

onMounted(() => {
	service.count.home
		.goodsCategory({
			type: "count"
		})
		.then((res: any[]) => {
			// 倒序
			const arr = orderBy(res, "total", "desc").map((e) => {
				return {
					...e,
					total: Number(e.total)
				};
			});

			// 前5个先
			const rank = arr.filter((_, i) => i < 5);

			// 合并其他
			const other = {
				typeName: "其他",
				total: arr.splice(5).reduce((a, b) => a + b.total, 0)
			};

			list.value = [...rank, other];

			// 设置图例
			chartOption.legend.data = list.value.map((e) => e.typeName);

			// 设置数据
			chartOption.series[0].data = list.value.map((e) => {
				return {
					value: e.total,
					name: e.typeName
				};
			});
		});
});
</script>

<style lang="scss" scoped>
.category-ratio {
	position: relative;

	.echarts {
		height: 150px;
		position: absolute;
		right: 0;
		top: 0;
	}

	.card__container {
		height: 100px;
	}
}
</style>
