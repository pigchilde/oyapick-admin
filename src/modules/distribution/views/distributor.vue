<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

			<cl-filter label="状态">
				<cl-select :options="options.status" prop="status" :width="140" />
			</cl-filter>

			<cl-flex1 />

			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索昵称/手机号/邀请码" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" name="distribution-distributor" setup>
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '正常', value: 1, type: 'success' },
		{ label: '冻结', value: 0, type: 'danger' }
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: '用户ID', prop: 'id', minWidth: 90 },
		{ label: '昵称', prop: 'nickName', minWidth: 160 },
		{ label: '手机号', prop: 'phone', minWidth: 140 },
		{ label: '邀请码', prop: 'inviteCode', minWidth: 120 },
		{ label: '上级ID', prop: 'inviterId', minWidth: 100 },
		{ label: '个人比例(bp)', prop: 'commissionRateBp', minWidth: 130 },
		{
			label: '状态',
			prop: 'distributorStatus',
			minWidth: 100,
			dict: options.status
		},
		{
			label: '创建时间',
			prop: 'createTime',
			minWidth: 160,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 320,
			buttons: [
				{
					label: '改比例',
					type: 'primary',
					onClick({ scope }) {
						handleUpdateRate(scope.row);
					}
				},
				{
					label: '冻结',
					type: 'danger',
					onClick({ scope }) {
						handleToggleFreeze(scope.row);
					},
					show({ scope }) {
						return Number(scope.row.distributorStatus) === 1;
					}
				},
				{
					label: '解冻',
					type: 'success',
					onClick({ scope }) {
						handleToggleFreeze(scope.row);
					},
					show({ scope }) {
						return Number(scope.row.distributorStatus) !== 1;
					}
				},
				{
					label: '改绑',
					type: 'warning',
					onClick({ scope }) {
						handleChangeBinding(scope.row);
					}
				},
				{
					label: '解绑',
					type: 'info',
					onClick({ scope }) {
						handleUnbind(scope.row);
					}
				}
			]
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.distribution.distributor
	},
	app => {
		app.refresh();
	}
);

async function handleUpdateRate(row: any) {
	const value = await ElMessageBox.prompt('请输入个人佣金比例(bp, 0-10000, 200即为2%)', '调整比例', {
		inputValue: String(row.commissionRateBp || 200)
	});
	const commissionRateBp = Number(value.value || 0);
	await service.distribution.distributor.updateRate({
		userId: row.id,
		commissionRateBp
	});
	ElMessage.success('更新成功');
	Crud.value?.refresh();
}

async function handleToggleFreeze(row: any) {
	await service.distribution.distributor.freeze({
		userId: row.id,
		status: Number(row.distributorStatus) === 1 ? 0 : 1
	});
	ElMessage.success('操作成功');
	Crud.value?.refresh();
}

async function handleChangeBinding(row: any) {
	const value = await ElMessageBox.prompt('请输入新的上级用户ID', '调整绑定关系');
	const newInviterId = Number(value.value || 0);
	await service.distribution.distributor.changeBinding({
		userId: row.id,
		newInviterId,
		reason: '后台人工改绑',
		ticketNo: `T${Date.now()}`
	});
	ElMessage.success('改绑成功');
	Crud.value?.refresh();
}

async function handleUnbind(row: any) {
	await service.distribution.distributor.unbind({
		userId: row.id,
		reason: '后台人工解绑',
		ticketNo: `T${Date.now()}`
	});
	ElMessage.success('解绑成功');
	Crud.value?.refresh();
}
</script>
