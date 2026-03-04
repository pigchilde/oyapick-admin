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
			<cl-search-key placeholder="搜索名称" />
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

<script lang="ts" name="goods-search-keyword" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "500px"
	},
	props: {
		labelWidth: "60px"
	},
	items: [
		{
			label: "名称",
			prop: "name",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{ label: "排序", prop: "sortNum", hook: "number", component: { name: "el-input-number" } }
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: "名称", prop: "name", minWidth: 140 },
		{ label: "排序", prop: "sortNum", minWidth: 140, sortable: "desc" },
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160
		},
		{
			label: "更新时间",
			prop: "updateTime",
			minWidth: 160
		},
		{ type: "op", buttons: ["edit", "delete"] }
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.goods.searchKeyword
	},
	(app) => {
		app.refresh();
	}
);
</script>
