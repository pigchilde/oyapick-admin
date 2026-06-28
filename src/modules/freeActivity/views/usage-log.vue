<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-flex1 />
			<cl-search-key placeholder="搜索用户姓名" />
		</cl-row>
		<cl-row>
			<cl-table ref="Table" />
		</cl-row>
		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" name="free-activity-usage-log" setup>
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { onActivated } from 'vue';
import { useFreeActivityService } from '../service';

const { service } = useCool();
const freeActivityService = useFreeActivityService(service);

const Crud = useCrud(
	{
		service: freeActivityService.usageLog
	},
	app => {
		app.refresh();
	}
);

const Table = useTable({
	columns: [
		{ label: 'ID', prop: 'id', minWidth: 80 },
		{ label: '活动ID', prop: 'activityId', minWidth: 100 },
		{ label: '用户ID', prop: 'userId', minWidth: 100 },
		{ label: '用户姓名', prop: 'fullName', minWidth: 140 },
		{ label: '业务日期', prop: 'bizDate', minWidth: 120 },
		{ label: '订单ID', prop: 'orderId', minWidth: 100 },
		{ label: '商品ID', prop: 'goodsId', minWidth: 100 },
		{ label: '使用次数', prop: 'usedCount', minWidth: 100 },
		{ label: '使用时间', prop: 'createTime', minWidth: 170 }
	]
});

onActivated(() => {
	Crud.value?.refresh();
});
</script>
