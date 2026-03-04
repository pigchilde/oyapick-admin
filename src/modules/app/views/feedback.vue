<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

			<cl-filter label="状态">
				<cl-select :options="options.status" prop="status" :width="120" />
			</cl-filter>

			<cl-filter label="反馈类型">
				<cl-select :options="options.type" prop="type" :width="120" />
			</cl-filter>

			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索联系方式、用户、处理人" />
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

<script lang="ts" name="app-feedback" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { computed, reactive } from "vue";
import { useDict } from "/$/dict";

const { service } = useCool();
const { dict } = useDict();

const options = reactive({
	status: [
		{
			label: "未处理",
			value: 0,
			type: "warning"
		},
		{
			label: "已处理",
			value: 1
		}
	],
	type: computed(() => {
		return dict.get("feedbackType");
	})
});

// cl-upsert
const Upsert = useUpsert({
	props: {
		labelWidth: 80
	},
	items: [
		{
			prop: "status",
			label: "状态",
			component: { name: "el-radio-group", options: options.status },
			required: true
		},
		{
			prop: "remark",
			label: "处理结果",
			component: {
				name: "el-input",
				props: {
					type: "textarea",
					rows: 4
				}
			}
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "index", label: "#", width: 60 },
		{ prop: "avatarUrl", label: "头像", component: { name: "cl-avatar" }, minWidth: 80 },
		{ prop: "nickName", label: "用户", minWidth: 120 },
		{ prop: "contact", label: "联系方式", minWidth: 120 },
		{
			prop: "content",
			label: "内容",
			component: { name: "cl-editor-preview", props: { name: "wang" } },
			minWidth: 120
		},
		{
			prop: "images",
			label: "图片",
			component: { name: "cl-image", props: { size: 60 } },
			minWidth: 100
		},
		{
			prop: "type",
			label: "类型",
			dict: options.type,
			dictFormatter(arr) {
				return arr.map((e) => e.label).join("、");
			},
			minWidth: 120
		},
		{ prop: "status", label: "状态", dict: options.status, minWidth: 100 },
		{ prop: "handlerName", label: "处理人", minWidth: 120 },
		{ prop: "remark", label: "处理结果", showOverflowTooltip: true, minWidth: 200 },
		{ prop: "createTime", label: "创建时间", sortable: "desc", minWidth: 160 },
		{ prop: "updateTime", label: "更新时间", sortable: "custom", minWidth: 160 },
		{
			type: "op",
			width: 120,
			buttons({ scope }) {
				if (scope.row.status == 0) {
					return ["edit"];
				}
				return [];
			}
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.app.feedback,
		dict: {
			label: {
				update: "处理"
			}
		}
	},
	(app) => {
		app.refresh();
	}
);
</script>
