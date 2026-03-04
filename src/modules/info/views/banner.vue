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
		<cl-upsert ref="Upsert">
			<template #slot-path="{ scope }">
				<el-row>
					<el-input
						v-model="scope.path"
						placeholder="如：/pages/goods/detail?id="
						:style="{ marginRight: '10px', flex: 1 }"
					/>

					<goods-select
						:ref="setRefs('goodsSelect')"
						:multiple="false"
						@change="onGoodsSelectChange"
					>
						<el-button @click="refs.goodsSelect?.open">选择商品</el-button>
					</goods-select>
				</el-row>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" name="info-banner" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import GoodsSelect from "/$/goods/components/select.vue";

const { service, refs, setRefs } = useCool();

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: "图片",
			prop: "pic",
			component: {
				name: "cl-upload",
				props: {
					size: [120, 230]
				}
			},
			required: true
		},
		{
			label: "描述",
			prop: "description",
			component: { name: "el-input", props: { clearable: true } }
		},
		{
			label: "跳转路径",
			prop: "path",
			component: { name: "slot-path" }
		},
		{
			label: "排序",
			prop: "sortNum",
			hook: "number",
			component: { name: "el-input-number" }
		},
		{
			label: "状态",
			prop: "status",
			flex: false,
			value: 1,
			component: { name: "cl-switch" }
		}
	]
});

// cl-table
const Table = useTable<Eps.InfoBannerEntity>({
	columns: [
		{ type: "selection" },
		{
			label: "图片",
			prop: "pic",
			minWidth: 160,
			component: { name: "cl-image", props: { size: [60, 115] } }
		},
		{ label: "描述", prop: "description", minWidth: 160 },
		{ label: "跳转路径", prop: "path", minWidth: 160 },
		{ label: "排序", prop: "sortNum", minWidth: 100, sortable: "desc" },
		{ label: "状态", prop: "status", minWidth: 100, component: { name: "cl-switch" } },
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
		service: service.info.banner
	},
	(app) => {
		app.refresh();
	}
);

// 选择商品后
function onGoodsSelectChange(id: number) {
	Upsert.value?.setForm("path", `/pages/goods/detail?id=${id}`);
}
</script>
