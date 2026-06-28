<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-filter label="业务日期">
				<el-input v-model="bizDate" placeholder="YYYY-MM-DD" clearable @change="refresh" />
			</cl-filter>
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

<script lang="ts" name="free-activity-claim-log" setup>
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { onActivated, ref } from 'vue';
import { useFreeActivityService } from '../service';

const { service } = useCool();
const freeActivityService = useFreeActivityService(service);
const bizDate = ref('');

const Crud = useCrud(
	{
		service: freeActivityService.claimLog
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
		{ label: '窗口', prop: 'slotKey', minWidth: 120 },
		{ label: '领取次数', prop: 'claimCount', minWidth: 100 },
		{ label: '领取时间', prop: 'createTime', minWidth: 170 }
	]
});

function refresh() {
	Crud.value?.refresh({ bizDate: bizDate.value || undefined });
}

onActivated(() => {
	refresh();
});
</script>
