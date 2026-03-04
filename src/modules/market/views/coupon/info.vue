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
				<cl-select :options="options.status" prop="status" :width="140" />
			</cl-filter>

			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索标题" />
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
			<template #slot-condition="{ scope }">
				<div class="condition">
					<div class="row">
						<span>满</span>
						<el-input-number
							v-model="scope.condition.fullAmount"
							:max="10000"
							:min="scope.amount"
						/>
						<span>减 {{ scope.amount || 0 }} 元</span>
					</div>
				</div>
			</template>
		</cl-upsert>
	</cl-crud>
</template>

<script lang="ts" name="market-coupon-info" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { reactive } from "vue";
import { isEmpty } from "lodash-es";
import dayjs from "dayjs";

const { service, router } = useCool();

const options = reactive({
	type: [
		{
			label: "满减券",
			value: 0
		}
	],
	status: [
		{
			label: "启用",
			value: 1
		},
		{
			label: "禁用",
			value: 0
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	props: {
		labelWidth: "100px"
	},
	items: [
		{
			label: "类型",
			prop: "type",
			value: 0,
			component: { name: "el-radio-group", options: options.type },
			required: true
		},
		{
			label: "标题",
			prop: "title",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "描述",
			prop: "description",
			component: { name: "el-input", props: { type: "textarea", rows: 4 } },
			required: true
		},

		{
			label: "金额",
			prop: "amount",
			hook: "number",
			component: {
				name: "el-input-number",
				props: {
					min: 0.01,
					max: 100000
				}
			},
			required: true,
			span: 12
		},
		{
			label: "有效期",
			prop: "time",
			component: {
				name: "el-date-picker",
				props: {
					type: "daterange",
					valueFormat: "YYYY-MM-DD"
				}
			},
			rules: {
				required: true,
				validator(rule, value, callback) {
					if (isEmpty(value)) {
						callback(Error("有效期不能为空"));
					} else {
						callback();
					}
				}
			},
			hook: "datetimeRange",
			span: 12
		},
		{
			label: "总数量",
			prop: "num",
			hook: "number",
			value: 100,
			component: { name: "el-input-number" },
			required: true,
			span: 12
		},
		{
			label: "已领取",
			prop: "receivedNum",
			hook: "number",
			value: 0,
			component: { name: "el-input-number" },
			required: true,
			span: 12
		},
		{
			label: "使用条件",
			prop: "condition",
			value: {
				fullAmount: undefined
			},
			component: { name: "slot-condition" },
			rules: {
				required: true,
				validator(rule, value, callback) {
					if (!value.fullAmount) {
						callback(Error("请填写满减条件"));
					} else {
						callback();
					}
				}
			}
		},
		{
			label: "状态",
			prop: "status",
			flex: false,
			component: { name: "cl-switch" },
			required: true
		}
	]
});

// cl-table
const Table = useTable<Eps.MarketCouponInfoEntity>({
	columns: [
		{ type: "selection" },
		{ label: "标题", prop: "title", minWidth: 200 },
		{ label: "描述", prop: "description", showOverflowTooltip: true, minWidth: 200 },
		{ label: "类型", prop: "type", minWidth: 120, dict: options.type },
		{
			label: "条件",
			prop: "condition",
			minWidth: 140,
			formatter(row) {
				switch (row.type) {
					case 0:
						return `满 ${row.condition?.fullAmount} 减 ${row.amount}`;

					default:
						return "无门槛";
				}
			}
		},
		{ label: "金额", prop: "amount", minWidth: 120, sortable: "custom" },
		{ label: "数量", prop: "num", minWidth: 120, sortable: "custom" },
		{ label: "已领取", prop: "receivedNum", minWidth: 120, sortable: "custom" },
		{ label: "状态", prop: "status", minWidth: 100, component: { name: "cl-switch" } },
		{
			label: "有效期",
			prop: "startTime",
			minWidth: 160,
			formatter(row) {
				return (
					dayjs(row.startTime).format("YYYY-MM-DD") +
					" ~ " +
					dayjs(row.endTime).format("YYYY-MM-DD")
				);
			}
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			component: { name: "cl-date-text" }
		},
		{
			label: "更新时间",
			prop: "updateTime",
			minWidth: 160,
			component: { name: "cl-date-text" }
		},
		{
			type: "op",
			width: 260,
			buttons: [
				"edit",
				"delete",
				{
					label: "领取列表",
					onClick({ scope }) {
						router.push({
							path: "/market/coupon/user",
							query: {
								id: scope.row.id,
								title: scope.row.title
							}
						});
					}
				}
			]
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.market.coupon.info
	},
	(app) => {
		app.refresh();
	}
);
</script>

<style lang="scss" scoped>
.condition {
	.row {
		display: flex;
		align-items: center;

		.el-input-number {
			margin: 0 10px;
			width: 200px;
		}
	}
}
</style>
