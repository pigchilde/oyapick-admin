<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<el-button @click="loadTrend">刷新趋势</el-button>
			<el-button @click="loadRanking">刷新排行</el-button>
			<cl-flex1 />
		</cl-row>

		<!-- 概览卡片 -->
		<cl-row>
			<el-row :gutter="14" style="width: 100%">
				<el-col :span="8">
					<el-card shadow="hover">
						<div style="color: #666; font-size: 13px">平台总发放佣金</div>
						<div style="font-size: 26px; font-weight: 700; margin-top: 10px">
							{{ overview.totalCommission?.toFixed?.(2) || '0.00' }}
						</div>
					</el-card>
				</el-col>
				<el-col :span="8">
					<el-card shadow="hover">
						<div style="color: #666; font-size: 13px">未结算佣金</div>
						<div style="font-size: 26px; font-weight: 700; margin-top: 10px">
							{{ overview.unsettledCommission?.toFixed?.(2) || '0.00' }}
						</div>
					</el-card>
				</el-col>
				<el-col :span="8">
					<el-card shadow="hover">
						<div style="color: #666; font-size: 13px">已提现金额</div>
						<div style="font-size: 26px; font-weight: 700; margin-top: 10px">
							{{ overview.wallet?.withdrawnAmount?.toFixed?.(2) || '0.00' }}
						</div>
					</el-card>
				</el-col>
			</el-row>
		</cl-row>

		<!-- 趋势与排行 -->
		<cl-row style="margin-top: 14px">
			<el-card shadow="never" style="width: 100%">
				<template #header>
					<div style="display: flex; align-items: center; gap: 10px">
						<span>趋势与排行</span>
						<el-input-number v-model="days" :min="1" :max="90" size="small" />
						<el-date-picker
							v-model="exportRange"
							type="datetimerange"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
							size="small"
						/>
						<cl-flex1 />
						<el-button type="success" size="small" @click="exportData('commission')">
							导出佣金
						</el-button>
						<el-button type="success" size="small" @click="exportData('withdraw')">
							导出提现
						</el-button>
						<el-button type="success" size="small" @click="exportData('ledger')">
							导出流水
						</el-button>
					</div>
				</template>

				<div style="margin-bottom: 14px">
					<h4>佣金趋势</h4>
					<el-table :data="trend" border stripe>
						<el-table-column prop="date" label="日期" width="160" />
						<el-table-column prop="commissionAmount" label="佣金金额" />
						<el-table-column prop="orderCount" label="订单数" />
					</el-table>
				</div>

				<div>
					<h4>分销排行</h4>
					<el-table :data="ranking" border stripe>
						<el-table-column prop="userId" label="用户ID" width="100" />
						<el-table-column prop="totalCommission" label="累计佣金" />
						<el-table-column prop="orderCount" label="结算订单数" />
					</el-table>
				</div>
			</el-card>
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" name="distribution-statistics" setup>
import { useCrud } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

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

// cl-crud
const Crud = useCrud(
	{
		service: service.distribution.statistics
	},
	() => {}
);

async function loadOverview() {
	const res = await service.distribution.statistics.overview();
	Object.assign(overview, res || {});
}

async function loadTrend() {
	const res = await service.distribution.statistics.trend({ days: days.value });
	trend.value = res || [];
}

async function loadRanking() {
	const res = await service.distribution.statistics.ranking({ limit: 20 });
	ranking.value = res || [];
}

async function exportData(type: 'commission' | 'withdraw' | 'ledger') {
	const payload: Record<string, any> = {};
	if (exportRange.value?.length === 2) {
		payload.startTime = exportRange.value[0];
		payload.endTime = exportRange.value[1];
	}
	const file = await service.distribution.statistics[type](payload);
	const blob = file instanceof Blob ? file : new Blob([file]);
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = `distribution-${type}-${Date.now()}.xls`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	ElMessage.success('导出成功');
}

onMounted(async () => {
	await Promise.all([loadOverview(), loadTrend(), loadRanking()]);
});
</script>
