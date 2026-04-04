<template>
	<div class="dist-page">
		<el-row :gutter="14">
			<el-col :span="8">
				<el-card shadow="hover">
					<div class="k-title">平台总发放佣金</div>
					<div class="k-value">{{ overview.totalCommission?.toFixed?.(2) || "0.00" }}</div>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<div class="k-title">未结算佣金</div>
					<div class="k-value">{{ overview.unsettledCommission?.toFixed?.(2) || "0.00" }}</div>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<div class="k-title">已提现金额</div>
					<div class="k-value">{{ overview.wallet?.withdrawnAmount?.toFixed?.(2) || "0.00" }}</div>
				</el-card>
			</el-col>
		</el-row>

		<el-card shadow="never" class="mt">
			<template #header>趋势与排行</template>
				<div class="toolbar">
					<el-input-number v-model="days" :min="1" :max="90" />
					<el-date-picker
						v-model="exportRange"
						type="datetimerange"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						value-format="YYYY-MM-DD HH:mm:ss"
					/>
					<el-button @click="loadTrend">刷新趋势</el-button>
					<el-button @click="loadRanking">刷新排行</el-button>
					<el-button type="success" @click="exportData('commission')">导出佣金</el-button>
				<el-button type="success" @click="exportData('withdraw')">导出提现</el-button>
				<el-button type="success" @click="exportData('ledger')">导出流水</el-button>
			</div>

			<el-table :data="trend" border stripe style="margin-bottom: 14px">
				<el-table-column prop="date" label="日期" width="160" />
				<el-table-column prop="commissionAmount" label="佣金金额" />
				<el-table-column prop="orderCount" label="订单数" />
			</el-table>

			<el-table :data="ranking" border stripe>
				<el-table-column prop="userId" label="用户ID" width="100" />
				<el-table-column prop="totalCommission" label="累计佣金" />
				<el-table-column prop="orderCount" label="结算订单数" />
			</el-table>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";

const { service } = useCool();

interface WalletOverview {
	withdrawnAmount?: number;
}

interface StatisticsOverview {
	totalCommission?: number;
	unsettledCommission?: number;
	wallet?: WalletOverview;
}

interface TrendRow {
	date: string;
	commissionAmount: number;
	orderCount: number;
}

interface RankingRow {
	userId: number;
	totalCommission: number;
	orderCount: number;
}

const days = ref(15);
const overview = reactive<StatisticsOverview>({});
const trend = ref<TrendRow[]>([]);
const ranking = ref<RankingRow[]>([]);
const exportRange = ref<string[]>([]);

async function loadOverview() {
	const res = await service.request({
		url: "/admin/distribution/statistics/overview",
		method: "GET"
	});
	Object.assign(overview, res || {});
}

async function loadTrend() {
	const res = await service.request({
		url: "/admin/distribution/statistics/trend",
		method: "POST",
		data: { days: days.value }
	});
	trend.value = res || [];
}

async function loadRanking() {
	const res = await service.request({
		url: "/admin/distribution/statistics/ranking",
		method: "POST",
		data: { limit: 20 }
	});
	ranking.value = res || [];
}

async function exportData(type: "commission" | "withdraw" | "ledger") {
	const payload: Record<string, any> = {};
	if (exportRange.value?.length === 2) {
		payload.startTime = exportRange.value[0];
		payload.endTime = exportRange.value[1];
	}
	const file = await service.request({
		url: `/admin/distribution/statistics/export/${type}`,
		method: "POST",
		data: payload,
		responseType: "blob"
	});
	const blob = file instanceof Blob ? file : new Blob([file]);
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `distribution-${type}-${Date.now()}.xls`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	ElMessage.success("导出成功");
}

onMounted(async () => {
	await Promise.all([loadOverview(), loadTrend(), loadRanking()]);
});
</script>

<style scoped>
.dist-page {
	padding: 10px;
}
.mt {
	margin-top: 14px;
}
.toolbar {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 14px;
}
.k-title {
	color: #666;
	font-size: 13px;
}
.k-value {
	font-size: 26px;
	font-weight: 700;
	margin-top: 10px;
}
</style>
