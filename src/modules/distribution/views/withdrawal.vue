<template>
	<div class="dist-page">
		<el-card shadow="never">
			<template #header>提现审核</template>
			<div class="toolbar">
				<el-input-number v-model="query.userId" :min="0" placeholder="用户ID" />
				<el-select v-model="query.status" clearable placeholder="状态" style="width: 140px">
					<el-option label="待审核" :value="0" />
					<el-option label="打款中" :value="1" />
					<el-option label="已打款" :value="2" />
					<el-option label="已驳回" :value="3" />
					<el-option label="打款失败" :value="4" />
				</el-select>
				<el-button type="primary" @click="search">查询</el-button>
			</div>

			<el-table :data="list" border stripe>
				<el-table-column prop="id" label="ID" width="90" />
				<el-table-column prop="applyNo" label="申请单号" width="200" />
				<el-table-column prop="userId" label="用户ID" width="100" />
				<el-table-column prop="applyAmount" label="申请金额" width="110" />
				<el-table-column prop="feeAmount" label="手续费" width="100" />
				<el-table-column prop="actualAmount" label="实发金额" width="110" />
				<el-table-column prop="status" label="状态" width="100">
					<template #default="{ row }">{{ statusText(row.status) }}</template>
				</el-table-column>
				<el-table-column prop="createTime" label="申请时间" width="180" />
				<el-table-column label="操作" fixed="right" width="280">
					<template #default="{ row }">
						<el-button v-if="row.status === 0" link type="success" @click="approve(row)">通过</el-button>
						<el-button v-if="row.status === 0" link type="danger" @click="reject(row)">驳回</el-button>
						<el-button v-if="row.status === 1" link type="primary" @click="markPaid(row)">标记成功</el-button>
						<el-button v-if="row.status === 1" link type="warning" @click="markFailed(row)">标记失败</el-button>
					</template>
				</el-table-column>
			</el-table>

			<div class="pager">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:total="total"
					:page-size="query.size"
					:current-page="query.page"
					@current-change="onPageChange"
				/>
			</div>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useCool } from "/@/cool";

const { service } = useCool();

interface WithdrawRow {
	id: number;
	applyNo: string;
	userId: number;
	applyAmount: number;
	feeAmount: number;
	actualAmount: number;
	status: number;
	createTime?: string;
}

interface WithdrawQuery {
	page: number;
	size: number;
	status?: number;
	userId?: number;
}

const list = ref<WithdrawRow[]>([]);
const total = ref(0);
const query = reactive<WithdrawQuery>({
	page: 1,
	size: 20,
	status: undefined,
	userId: undefined
});

const statusText = (status: number) =>
	({ 0: "待审核", 1: "打款中", 2: "已打款", 3: "已驳回", 4: "打款失败", 5: "已取消" } as Record<
		number,
		string
	>)[Number(status)];

async function load() {
	const res = await service.request({
		url: "/admin/distribution/withdraw/page",
		method: "POST",
		data: query
	});
	list.value = res?.list || [];
	total.value = Number(res?.pagination?.total || 0);
}

async function search() {
	query.page = 1;
	await load();
}

function onPageChange(page: number) {
	query.page = page;
	load();
}

async function approve(row: WithdrawRow) {
	await service.request({
		url: "/admin/distribution/withdraw/approve",
		method: "POST",
		data: { id: row.id, autoPay: false }
	});
	ElMessage.success("审核通过");
	await load();
}

async function reject(row: WithdrawRow) {
	const value = await ElMessageBox.prompt("请输入驳回原因", "提现驳回", {
		inputValue: "风控驳回"
	});
	await service.request({
		url: "/admin/distribution/withdraw/reject",
		method: "POST",
		data: { id: row.id, reason: value.value || "风控驳回" }
	});
	ElMessage.success("已驳回");
	await load();
}

async function markPaid(row: WithdrawRow) {
	await service.request({
		url: "/admin/distribution/withdraw/markPaid",
		method: "POST",
		data: { id: row.id, tradeNo: `MANUAL${Date.now()}` }
	});
	ElMessage.success("已标记打款成功");
	await load();
}

async function markFailed(row: WithdrawRow) {
	await service.request({
		url: "/admin/distribution/withdraw/markFailed",
		method: "POST",
		data: { id: row.id, reason: "人工标记失败" }
	});
	ElMessage.success("已标记失败");
	await load();
}

onMounted(load);
</script>

<style scoped>
.dist-page {
	padding: 10px;
}
.toolbar {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 14px;
}
.pager {
	display: flex;
	justify-content: flex-end;
	margin-top: 14px;
}
</style>
