<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

			<cl-filter label="状态">
				<cl-select :options="options.status" prop="status" :width="120" />
			</cl-filter>

			<cl-flex1 />

			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索分销商ID/下单用户ID/订单ID" />
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

<script lang="ts" name="distribution-commission" setup>
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '预计', value: 0 },
		{ label: '冻结', value: 1, type: 'warning' },
		{ label: '可提现', value: 2, type: 'success' },
		{ label: '取消', value: 3, type: 'info' },
		{ label: '反冲', value: 4, type: 'danger' }
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: 'ID', prop: 'id', minWidth: 90 },
		{ label: '订单ID', prop: 'orderId', minWidth: 100 },
		{ label: '分销商ID', prop: 'distributorUserId', minWidth: 110 },
		{ label: '下单用户ID', prop: 'buyerUserId', minWidth: 110 },
		{ label: '实付金额', prop: 'baseAmount', minWidth: 110, sortable: 'custom' },
		{ label: '比例(bp)', prop: 'rateBp', minWidth: 100 },
		{ label: '佣金', prop: 'commissionAmount', minWidth: 100, sortable: 'custom' },
		{
			label: '状态',
			prop: 'status',
			minWidth: 100,
			dict: options.status
		},
		{ label: '结算时间', prop: 'settleAt', minWidth: 160, sortable: 'custom' },
		{ label: '创建时间', prop: 'createTime', minWidth: 160, sortable: 'desc' },
		{
			type: 'op',
			width: 120,
			buttons: [
				{
					label: '释放冻结',
					type: 'warning',
					onClick({ scope }) {
						handleReleaseFrozen(scope.row);
					},
					show({ scope }) {
						return Number(scope.row.status) === 1;
					}
				}
			]
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.distribution.commission
	},
	app => {
		app.refresh();
	}
);

async function handleReleaseFrozen(row: any) {
	try {
		await ElMessageBox.confirm('确定要手动释放该冻结佣金吗？', '释放确认', {
			type: 'warning'
		});
		await service.distribution.commission.releaseFrozen({ id: row.id });
		ElMessage.success('释放成功');
		Crud.value?.refresh();
	} catch {
		// 取消操作
	}
}
</script>
