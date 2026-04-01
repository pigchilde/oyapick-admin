<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />

			<cl-filter label="状态">
				<cl-select :options="options.status" prop="status" :width="120" />
			</cl-filter>

			<cl-filter label="商品ID">
				<cl-select :options="options.goods" prop="goodsId" :width="160" clearable />
			</cl-filter>

			<cl-flex1 />
			<cl-search-key placeholder="搜索备注" />

			<el-button type="primary" @click="runOnceAll">执行一次(全部运行中)</el-button>
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert" />
	</cl-crud>

	<el-dialog v-model="previewVisible" title="计划预览" width="560px">
		<el-descriptions :column="1" border v-if="previewResult">
			<el-descriptions-item label="预计参与次数">{{ previewResult.expectedCount }}</el-descriptions-item>
			<el-descriptions-item label="预计最小份数">{{ previewResult.expectedMinShares }}</el-descriptions-item>
			<el-descriptions-item label="预计最大份数">{{ previewResult.expectedMaxShares }}</el-descriptions-item>
			<el-descriptions-item label="机器人总数">{{ previewResult.robotTotal }}</el-descriptions-item>
			<el-descriptions-item label="可用机器人">{{ previewResult.availableRobotCount ?? '-' }}</el-descriptions-item>
			<el-descriptions-item label="滚动窗口上限">{{ previewResult.rollingWindowLimit }}</el-descriptions-item>
			<el-descriptions-item label="剩余库存">{{ previewResult.remainingShares ?? '-' }}</el-descriptions-item>
			<el-descriptions-item label="库存是否可能限制">
				<el-tag :type="previewResult.inventoryMayLimit ? 'warning' : 'success'">
					{{ previewResult.inventoryMayLimit ? '是' : '否' }}
				</el-tag>
			</el-descriptions-item>
		</el-descriptions>
	</el-dialog>

	<el-dialog v-model="logVisible" title="执行日志" width="900px">
		<el-table :data="logs" border style="width: 100%">
			<el-table-column prop="batchNo" label="批次" min-width="140" />
			<el-table-column prop="plannedCount" label="计划" width="80" />
			<el-table-column prop="queuedCount" label="入队" width="80" />
			<el-table-column prop="successCount" label="成功" width="80" />
			<el-table-column prop="failCount" label="失败" width="80" />
			<el-table-column prop="skipCount" label="跳过" width="80" />
			<el-table-column prop="cancelCount" label="取消" width="80" />
			<el-table-column prop="createTime" label="创建时间" min-width="160" />
		</el-table>
	</el-dialog>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'robot-task'
});

import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '停用', value: 0, type: 'danger' },
		{ label: '运行', value: 1, type: 'success' }
	],
	goods: [] as Array<{ label: string; value: number }>
});

const previewVisible = ref(false);
const previewResult = ref<any>(null);
const logVisible = ref(false);
const logs = ref<any[]>([]);

const Crud = useCrud(
	{
		service: service.robot.task,
		async onRefresh(params, { next, render }) {
			const res = await next(params);
			const list = Array.isArray(res?.list) ? normalizeRow(res.list) : [];

			if (res && typeof res === 'object') {
				render({
					...res,
					list
				});
			} else {
				render({
					list
				});
			}
		}
	},
	app => {
		app.refresh();
	}
);

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: 'ID', prop: 'id', width: 80 },
		{ label: '商品ID', prop: 'goodsId', minWidth: 100 },
		{ label: '开始时间', prop: 'startTime', minWidth: 160 },
		{ label: '结束时间', prop: 'endTime', minWidth: 160 },
		{ label: '每小时参与次数', prop: 'countPerHour', minWidth: 140 },
		{ label: '购买区间', prop: 'buyRange', minWidth: 120 },
		{ label: '机器人间隔(分钟)', prop: 'sameRobotMinIntervalMinutes', minWidth: 140 },
		{ label: '同机器人最大参与', prop: 'sameRobotMaxBuysPerGoods', minWidth: 140 },
		{ label: '状态', prop: 'status', dict: options.status, width: 100 },
		{ label: '备注', prop: 'remark', minWidth: 180, showOverflowTooltip: true },
		{
			type: 'op',
			width: 380,
			buttons({ scope }) {
				const row = scope.row;
				const actions: any[] = [];

				if (row.status === 1) {
					actions.push({
						label: '停止',
						type: 'danger',
						onClick: () => stopTask(row)
					});
				} else {
					actions.push({
						label: '启动',
						type: 'success',
						onClick: () => startTask(row)
					});
				}

				actions.push(
					{
						label: '执行一次',
						type: 'primary',
						onClick: () => runOnce(row)
					},
					{
						label: '预览',
						type: 'warning',
						onClick: () => preview(row)
					},
					{
						label: '日志',
						type: 'info',
						onClick: () => showLogs(row)
					},
					'edit',
					'delete'
				);

				return actions;
			}
		}
	]
});

const Upsert = useUpsert({
	dialog: {
		width: '760px'
	},
	items: [
		{
			label: '商品ID',
			prop: 'goodsId',
			required: true,
			component: {
				name: 'cl-select',
				props: {
					options: computed(() => options.goods),
					filterable: true
				}
			}
		},
		{
			label: '开始时间',
			prop: 'startTime',
			required: true,
			component: {
				name: 'el-date-picker',
				props: {
					type: 'datetime',
					format: 'YYYY-MM-DD HH:mm:ss',
					valueFormat: 'YYYY-MM-DD HH:mm:ss'
				}
			}
		},
		{
			label: '结束时间',
			prop: 'endTime',
			required: true,
			component: {
				name: 'el-date-picker',
				props: {
					type: 'datetime',
					format: 'YYYY-MM-DD HH:mm:ss',
					valueFormat: 'YYYY-MM-DD HH:mm:ss'
				}
			}
		},
		{
			label: '每小时参与次数',
			prop: 'countPerHour',
			value: 6,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 1, max: 2000 }
			}
		},
		{
			label: '最少购买份数',
			prop: 'minBuyCount',
			value: 1,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 1, max: 1000 }
			}
		},
		{
			label: '最多购买份数',
			prop: 'maxBuyCount',
			value: 1,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 1, max: 1000 }
			}
		},
		{
			label: '同机器人最小间隔(分钟)',
			prop: 'sameRobotMinIntervalMinutes',
			value: 60,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 1, max: 10080 }
			}
		},
		{
			label: '同机器人最大参与次数',
			prop: 'sameRobotMaxBuysPerGoods',
			value: 10,
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 1, max: 100000 }
			}
		},
		{
			label: '状态',
			prop: 'status',
			value: 0,
			component: {
				name: 'el-radio-group',
				options: options.status
			}
		},
		{
			label: '备注',
			prop: 'remark',
			component: {
				name: 'el-input',
				props: { type: 'textarea', rows: 3 }
			}
		}
	]
});

function normalizeRow(list: any[]) {
	return list.map(item => ({
		...item,
		buyRange: `${item.minBuyCount}-${item.maxBuyCount}`
	}));
}

async function fetchGoods() {
	try {
		const size = 500;
		let page = 1;
		const allGoods: any[] = [];

		while (true) {
			const res = await service.goods.info.page({ page, size });
			const list = Array.isArray(res?.list) ? res.list : [];
			allGoods.push(...list);

			if (list.length < size) {
				break;
			}

			page += 1;
		}

		options.goods = allGoods.map((g: any) => ({
			label: `${g.id} - ${g.title}`,
			value: g.id
		}));
	} catch (err: any) {
		console.error(err);
	}
}

function isConfirmCancel(err: any) {
	return err === 'cancel' || err === 'close';
}

function showRequestError(err: any, fallback: string) {
	ElMessage.error(err?.message || fallback);
}

async function startTask(row: any) {
	try {
		await ElMessageBox.confirm(`确认启动任务 #${row.id} 吗？`, '提示', { type: 'warning' });
		await service.robot.task.start({ id: row.id });
		ElMessage.success('启动成功');
		Crud.value?.refresh();
	} catch (err: any) {
		if (isConfirmCancel(err)) {
			return;
		}

		showRequestError(err, '启动失败');
	}
}

async function stopTask(row: any) {
	try {
		await ElMessageBox.confirm(`确认停止任务 #${row.id} 吗？`, '提示', { type: 'warning' });
		const res = await service.robot.task.stop({ id: row.id });
		ElMessage.success(`停止成功，取消计划 ${res?.canceledCount ?? 0} 条`);
		Crud.value?.refresh();
	} catch (err: any) {
		if (isConfirmCancel(err)) {
			return;
		}

		showRequestError(err, '停止失败');
	}
}

async function runOnce(row: any) {
	try {
		await ElMessageBox.confirm(`确认执行任务 #${row.id} 一次吗？`, '提示', { type: 'warning' });
		const res = await service.robot.task.runOnce({ taskId: row.id });
		ElMessage.success(`触发成功，本次触发任务数：${res?.triggeredTaskCount ?? 0}`);
	} catch (err: any) {
		if (isConfirmCancel(err)) {
			return;
		}

		showRequestError(err, '执行失败');
	}
}

async function runOnceAll() {
	try {
		await ElMessageBox.confirm('确认对全部运行中的任务执行一次吗？', '提示', { type: 'warning' });
		const res = await service.robot.task.runOnce();
		ElMessage.success(`触发成功，本次触发任务数：${res?.triggeredTaskCount ?? 0}`);
	} catch (err: any) {
		if (isConfirmCancel(err)) {
			return;
		}

		showRequestError(err, '批量执行失败');
	}
}

async function preview(row: any) {
	const data = {
		goodsId: row.goodsId,
		startTime: row.startTime,
		endTime: row.endTime,
		countPerHour: row.countPerHour,
		minBuyCount: row.minBuyCount,
		maxBuyCount: row.maxBuyCount,
		sameRobotMinIntervalMinutes: row.sameRobotMinIntervalMinutes,
		sameRobotMaxBuysPerGoods: row.sameRobotMaxBuysPerGoods
	};
	previewResult.value = await service.robot.task.previewPlan({ data });
	previewVisible.value = true;
}

async function showLogs(row: any) {
	const res = await service.robot.task.logPage({ taskId: row.id, page: 1, size: 50 });
	logs.value = res.list || [];
	logVisible.value = true;
}

onMounted(async () => {
	await fetchGoods();
});
</script>
