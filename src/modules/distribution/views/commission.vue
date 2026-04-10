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

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '可提现', value: 0, type: 'success' },
		{ label: '反冲', value: 1, type: 'danger' }
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
		{ label: '到账时间', prop: 'creditedAt', minWidth: 160, sortable: 'custom' },
		{ label: '创建时间', prop: 'createTime', minWidth: 160, sortable: 'desc' },
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
</script>
