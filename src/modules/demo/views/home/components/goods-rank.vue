<template>
	<div class="goods-rank">
		<div class="goods-rank__header">
			<span>商品销售排行</span>
		</div>

		<div class="goods-rank__container">
			<div class="goods-rank__table">
				<cl-crud ref="Crud" padding="0">
					<cl-table ref="Table" :border="false" />
				</cl-crud>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useCrud, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

const Crud = useCrud(
	{
		service: service.count.home,
		dict: {
			api: {
				page: "goodsRank"
			}
		}
	},
	(app) => {
		app.refresh({
			type: "amount",
			limit: 10
		});
	}
);

const Table = useTable({
	autoHeight: false,
	contextMenu: [],
	columns: [
		{
			label: "排名",
			type: "index",
			width: 60
		},
		{
			label: "商品标题",
			prop: "title",
			align: "left",
			showOverflowTooltip: true,
			minWidth: 200
		},
		{
			label: "商品图标",
			prop: "mainPic",
			width: 140,
			component: {
				name: "cl-image",
				props: {
					size: 40
				}
			}
		},
		{
			label: "销售金额",
			prop: "total",
			width: 140
		}
	]
});
</script>

<style lang="scss" scoped>
.goods-rank {
	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 15px;
		font-weight: bold;
		padding: 0 20px;
	}

	&__table {
		padding: 0 10px 20px 10px;
		margin: 0 10px;
		background-color: var(--el-bg-color);
	}
}
</style>
