<template>
	<div class="dist-page">
		<el-card shadow="never">
			<template #header>分销商管理</template>
			<div class="toolbar">
				<el-input v-model="query.keyWord" placeholder="昵称/手机号/邀请码" clearable style="width: 260px" />
				<el-select v-model="query.status" clearable placeholder="状态" style="width: 120px">
					<el-option label="正常" :value="1" />
					<el-option label="冻结" :value="0" />
				</el-select>
				<el-button type="primary" @click="search">查询</el-button>
			</div>

			<el-table :data="list" border stripe>
				<el-table-column prop="id" label="用户ID" width="90" />
				<el-table-column prop="nickName" label="昵称" min-width="160" />
				<el-table-column prop="phone" label="手机号" width="140" />
				<el-table-column prop="inviteCode" label="邀请码" width="120" />
				<el-table-column prop="inviterId" label="上级ID" width="100" />
				<el-table-column prop="commissionRateBp" label="个人比例(bp)" width="130" />
				<el-table-column prop="distributorStatus" label="状态" width="100">
					<template #default="{ row }">
						<el-tag :type="Number(row.distributorStatus) === 1 ? 'success' : 'danger'">
							{{ Number(row.distributorStatus) === 1 ? "正常" : "冻结" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="320" fixed="right">
					<template #default="{ row }">
						<el-button link type="primary" @click="changeRate(row)">改比例</el-button>
						<el-button
							link
							:type="Number(row.distributorStatus) === 1 ? 'danger' : 'success'"
							@click="toggleFreeze(row)"
						>
							{{ Number(row.distributorStatus) === 1 ? "冻结" : "解冻" }}
						</el-button>
						<el-button link type="warning" @click="changeBinding(row)">改绑</el-button>
						<el-button link type="info" @click="unbind(row)">解绑</el-button>
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

interface DistributorRow {
	id: number;
	nickName?: string;
	phone?: string;
	inviteCode?: string;
	inviterId?: number;
	commissionRateBp?: number;
	distributorStatus: number;
}

interface DistributorQuery {
	page: number;
	size: number;
	keyWord: string;
	status?: number;
}

const list = ref<DistributorRow[]>([]);
const total = ref(0);
const query = reactive<DistributorQuery>({
	page: 1,
	size: 20,
	keyWord: "",
	status: undefined
});

async function load() {
	const res = await service.request({
		url: "/admin/distribution/distributor/page",
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

async function changeRate(row: DistributorRow) {
	const value = await ElMessageBox.prompt("请输入个人佣金比例(bp, 0-10000)", "调整比例", {
		inputValue: String(row.commissionRateBp || 200)
	});
	const commissionRateBp = Number(value.value || 0);
	await service.request({
		url: "/admin/distribution/distributor/updateRate",
		method: "POST",
		data: {
			userId: row.id,
			commissionRateBp
		}
	});
	ElMessage.success("更新成功");
	await load();
}

async function toggleFreeze(row: DistributorRow) {
	await service.request({
		url: "/admin/distribution/distributor/freeze",
		method: "POST",
		data: {
			userId: row.id,
			status: Number(row.distributorStatus) === 1 ? 0 : 1
		}
	});
	ElMessage.success("操作成功");
	await load();
}

async function changeBinding(row: DistributorRow) {
	const value = await ElMessageBox.prompt("请输入新的上级用户ID", "调整绑定关系");
	const newInviterId = Number(value.value || 0);
	await service.request({
		url: "/admin/distribution/distributor/changeBinding",
		method: "POST",
		data: {
			userId: row.id,
			newInviterId,
			reason: "后台人工改绑",
			ticketNo: `T${Date.now()}`
		}
	});
	ElMessage.success("改绑成功");
	await load();
}

async function unbind(row: DistributorRow) {
	await service.request({
		url: "/admin/distribution/distributor/unbind",
		method: "POST",
		data: {
			userId: row.id,
			reason: "后台人工解绑",
			ticketNo: `T${Date.now()}`
		}
	});
	ElMessage.success("解绑成功");
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
