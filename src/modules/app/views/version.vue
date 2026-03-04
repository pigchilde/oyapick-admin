<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />

			<cl-filter label="状态">
				<cl-select :options="options.status" prop="status" :width="120" />
			</cl-filter>

			<cl-filter label="类型">
				<cl-select :options="options.type" prop="type" :width="120" />
			</cl-filter>

			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索名称、版本" />
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
	</cl-crud>
</template>

<script lang="ts" name="app-version" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useDict } from "/$/dict";
import { computed, reactive } from "vue";

const { service } = useCool();
const { dict } = useDict();

const options = reactive({
	// 状态
	status: [
		{
			label: "启用",
			value: 1,
			type: "success"
		},
		{
			label: "禁用",
			value: 0,
			type: "danger"
		}
	],
	// 类型
	type: computed(() => {
		return dict.get("upgradeType");
	})
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{ span: 12, prop: "name", label: "名称", required: true, component: { name: "el-input" } },
		{
			span: 12,
			prop: "version",
			label: "版本号",
			required: true,
			component: { name: "el-input" }
		},
		{
			prop: "description",
			label: "描述",
			required: true,
			component: {
				name: "el-input",
				props: {
					type: "textarea",
					rows: 4
				}
			}
		},
		{
			prop: "type",
			label: "类型",
			value: 0,
			component: { name: "el-radio-group", options: options.type },
			required: true
		},
		{
			prop: "url",
			label: "下载地址",
			component: { name: "cl-upload", props: { type: "file", limit: 1 } },
			required: true
		},
		{
			prop: "hotUpdate",
			label: "热更新",
			flex: false,
			value: 0,
			component: {
				name: "cl-switch"
			},
			required: true
		},
		{
			prop: "forceUpdate",
			label: "强制更新",
			flex: false,
			value: 0,
			component: {
				name: "cl-switch"
			},
			required: true
		},
		{
			prop: "status",
			label: "状态",
			value: 1,
			flex: false,
			component: { name: "cl-switch" },
			required: true
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ prop: "name", label: "名称", minWidth: 150 },
		{ prop: "version", label: "版本号", minWidth: 100 },
		{ prop: "type", label: "类型", dict: options.type, minWidth: 100 },
		{ prop: "url", label: "下载地址", component: { name: "cl-link" }, minWidth: 120 },
		{
			prop: "forceUpdate",
			label: "强制更新",
			formatter(row) {
				return row.forceUpdate ? "是" : "否";
			},
			minWidth: 100
		},
		{
			prop: "hotUpdate",
			label: "热更新",
			formatter(row) {
				return row.hotUpdate ? "是" : "否";
			},
			minWidth: 100
		},
		{ prop: "status", label: "状态", component: { name: "cl-switch" }, minWidth: 100 },
		{ prop: "description", label: "描述", showOverflowTooltip: true, minWidth: 200 },
		{ prop: "createTime", label: "创建时间", sortable: "desc", minWidth: 160 },
		{ prop: "updateTime", label: "更新时间", sortable: "custom", minWidth: 160 },
		{ type: "op", buttons: ["edit", "delete"] }
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.app.version
	},
	(app) => {
		app.refresh();
	}
);
</script>
