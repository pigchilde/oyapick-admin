<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />

			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索规则名称" />
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

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />

		<!-- 详情弹窗 -->
		<el-dialog v-model="detailVisible" title="规则详情" width="800px">
			<div v-if="detailData">
				<el-descriptions :column="1" border>
					<el-descriptions-item label="规则名称">
						{{ detailData.title }}
					</el-descriptions-item>
					<el-descriptions-item label="规则内容">
						<div v-html="detailData.content"></div>
					</el-descriptions-item>
					<el-descriptions-item label="排序">
						{{ detailData.sortNum }}
					</el-descriptions-item>
					<el-descriptions-item label="状态">
						<el-tag :type="detailData.status === 1 ? 'success' : 'info'">
							{{ detailData.status === 1 ? '启用' : '禁用' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="创建时间">
						{{ detailData.createTime }}
					</el-descriptions-item>
					<el-descriptions-item label="更新时间">
						{{ detailData.updateTime }}
					</el-descriptions-item>
				</el-descriptions>
			</div>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" name="info-rule" setup>
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ref } from 'vue';

const { service } = useCool();

// 详情弹窗
const detailVisible = ref(false);
const detailData = ref<Eps.InfoRuleEntity | null>(null);

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: '规则名称',
			prop: 'title',
			component: { name: 'el-input', props: { clearable: true } },
			required: true
		},
		{
			label: '规则内容',
			prop: 'content',
			component: { name: 'cl-editor-wang' },
			required: true
		},
		{
			label: '排序',
			prop: 'sortNum',
			hook: 'number',
			component: { name: 'el-input-number' }
		},
		{
			label: '状态',
			prop: 'status',
			flex: false,
			value: 1,
			component: { name: 'cl-switch' }
		}
	]
});

// cl-table
const Table = useTable<Eps.InfoRuleEntity>({
	columns: [
		{ type: 'selection' },
		{ label: '规则名称', prop: 'title', minWidth: 200, align: 'left' },
		{ label: '排序', prop: 'sortNum', minWidth: 100, sortable: 'desc' },
		{ label: '状态', prop: 'status', minWidth: 100, component: { name: 'cl-switch' } },
		{ label: '创建时间', prop: 'createTime', minWidth: 160 },
		{ label: '更新时间', prop: 'updateTime', minWidth: 160 },
		{
			type: 'op',
			buttons: [
				'edit',
				'delete'
				/* {
					label: '详情',
					type: 'primary',
					onClick(scope: any) {
						viewDetail(scope.row);
					}
				} */
			]
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.info.rule
	},
	app => {
		app.refresh();
	}
);

// 查看详情
/* function viewDetail(row: Eps.InfoRuleEntity) {
	detailData.value = row;
	detailVisible.value = true;
} */
</script>
