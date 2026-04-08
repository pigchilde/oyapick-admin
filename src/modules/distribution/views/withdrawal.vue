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
			<cl-search-key placeholder="搜索申请单号/用户ID" />
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

<script lang="ts" name="distribution-withdrawal" setup>
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '待审核', value: 0, type: 'warning' },
		{ label: '打款中', value: 1, type: '' },
		{ label: '已打款', value: 2, type: 'success' },
		{ label: '已驳回', value: 3, type: 'danger' },
		{ label: '打款失败', value: 4, type: 'info' }
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', minWidth: 90 },
		{ label: '申请单号', prop: 'applyNo', minWidth: 200 },
		{ label: '用户ID', prop: 'userId', minWidth: 100 },
		{ label: '申请金额', prop: 'applyAmount', minWidth: 110, sortable: 'custom' },
		{ label: '手续费', prop: 'feeAmount', minWidth: 100 },
		{ label: '实发金额', prop: 'actualAmount', minWidth: 110, sortable: 'custom' },
		{
			label: '状态',
			prop: 'status',
			minWidth: 100,
			dict: options.status
		},
		{ label: '申请时间', prop: 'createTime', minWidth: 160, sortable: 'desc' },
		{
			type: 'op',
			width: 280,
			buttons: [
				{
					label: '通过',
					type: 'success',
					onClick({ scope }) {
						handleApprove(scope.row);
					},
					show({ scope }) {
						return scope.row.status === 0;
					}
				},
				{
					label: '驳回',
					type: 'danger',
					onClick({ scope }) {
						handleReject(scope.row);
					},
					show({ scope }) {
						return scope.row.status === 0;
					}
				},
				{
					label: '标记成功',
					type: 'primary',
					onClick({ scope }) {
						handleMarkPaid(scope.row);
					},
					show({ scope }) {
						return scope.row.status === 1;
					}
				},
				{
					label: '标记失败',
					type: 'warning',
					onClick({ scope }) {
						handleMarkFailed(scope.row);
					},
					show({ scope }) {
						return scope.row.status === 1;
					}
				}
			]
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.distribution.withdrawal
	},
	app => {
		app.refresh();
	}
);

async function handleApprove(row: any) {
	await service.distribution.withdrawal.approve({ id: row.id, autoPay: false });
	ElMessage.success('审核通过');
	Crud.value?.refresh();
}

async function handleReject(row: any) {
	const value = await ElMessageBox.prompt('请输入驳回原因', '提现驳回', {
		inputValue: '风控驳回'
	});
	await service.distribution.withdrawal.reject({ id: row.id, reason: value.value || '风控驳回' });
	ElMessage.success('已驳回');
	Crud.value?.refresh();
}

async function handleMarkPaid(row: any) {
	await service.distribution.withdrawal.markPaid({ id: row.id, tradeNo: `MANUAL${Date.now()}` });
	ElMessage.success('已标记打款成功');
	Crud.value?.refresh();
}

async function handleMarkFailed(row: any) {
	await service.distribution.withdrawal.markFailed({ id: row.id, reason: '人工标记失败' });
	ElMessage.success('已标记失败');
	Crud.value?.refresh();
}
</script>
