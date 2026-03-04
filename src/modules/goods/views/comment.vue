<template>
	<cl-crud ref="Crud">
		<cl-view-head />

		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索用户昵称、评论内容" />
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

<script lang="ts" name="goods-comment" setup>
import { useCrud, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service, route } = useCool();

// cl-table
const Table = useTable({
	contextMenu: [],
	columns: [
		{ label: "#", type: "index" },
		{ label: "用户昵称", prop: "nickName", minWidth: 140 },
		{ label: "内容", prop: "content", showOverflowTooltip: true, minWidth: 200 },
		{
			label: "星数",
			prop: "starCount",
			minWidth: 150,
			component: { name: "el-rate", props: { disabled: true } }
		},
		{
			label: "图片",
			prop: "pics",
			minWidth: 100,
			component: { name: "cl-image", props: { size: 60 } }
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			component: { name: "cl-date-text" }
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.goods.comment
	},
	(app) => {
		app.refresh({
			goodsId: route.query.id
		});
	}
);
</script>
