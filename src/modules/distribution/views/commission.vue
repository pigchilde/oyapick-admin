<template>
	<div class="dist-page">
		<el-card shadow="never">
			<template #header>佣金订单</template>
			<div class="toolbar">
				<el-input-number v-model="query.distributorUserId" :min="0" placeholder="分销商ID" />
				<el-input-number v-model="query.buyerUserId" :min="0" placeholder="下单用户ID" />
				<el-input-number v-model="query.orderId" :min="0" placeholder="订单ID" />
				<el-select v-model="query.status" clearable placeholder="状态" style="width: 120px">
					<el-option label="预计" :value="0" />
					<el-option label="冻结" :value="1" />
					<el-option label="可提现" :value="2" />
					<el-option label="取消" :value="3" />
					<el-option label="反冲" :value="4" />
				</el-select>
				<el-button type="primary" @click="search">查询</el-button>
			</div>

			<el-table :data="list" border stripe>
				<el-table-column prop="id" label="ID" width="90" />
				<el-table-column prop="orderId" label="订单ID" width="100" />
				<el-table-column prop="distributorUserId" label="分销商ID" width="110" />
				<el-table-column prop="buyerUserId" label="下单用户ID" width="110" />
				<el-table-column prop="baseAmount" label="实付金额" width="110" />
				<el-table-column prop="rateBp" label="比例(bp)" width="100" />
				<el-table-column prop="commissionAmount" label="佣金" width="100" />
				<el-table-column prop="status" label="状态" width="100">
					<template #default="{ row }">{{ statusText(row.status) }}</template>
				</el-table-column>
				<el-table-column prop="settleAt" label="结算时间" width="180" />
				<el-table-column prop="createTime" label="创建时间" width="180" />
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
import { useCool } from "/@/cool";

const { service } = useCool();

interface CommissionRow {
	id: number;
	orderId: number;
	distributorUserId: number;
	buyerUserId: number;
	baseAmount: number;
	rateBp: number;
	commissionAmount: number;
	status: number;
	settleAt?: string;
	createTime?: string;
}

interface CommissionQuery {
	page: number;
	size: number;
	status?: number;
	distributorUserId?: number;
	buyerUserId?: number;
	orderId?: number;
}

const list = ref<CommissionRow[]>([]);
const total = ref(0);
const query = reactive<CommissionQuery>({
	page: 1,
	size: 20,
	status: undefined,
	distributorUserId: undefined,
	buyerUserId: undefined,
	orderId: undefined
});

const statusText = (status: number) => {
	return ({ 0: "预计", 1: "冻结", 2: "可提现", 3: "取消", 4: "反冲" } as Record<number, string>)[
		Number(status)
	];
};

async function load() {
	const res = await service.request({
		url: "/admin/distribution/commission/page",
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
