<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

			<cl-filter label="支付方式">
				<cl-select :options="options.payType" prop="payType" :width="140" />
			</cl-filter>

			<cl-filter label="订单状态">
				<cl-select :options="options.status" prop="status" :width="140" />
			</cl-filter>

			<cl-filter label="商品ID">
				<cl-select
					:options="options.goods"
					prop="goodsId"
					:width="220"
					clearable
					filterable
					placeholder="请选择商品"
				/>
			</cl-filter>

			<cl-filter label="用户类型">
				<cl-select :options="options.userType" prop="isRobot" :width="140" clearable />
			</cl-filter>

			<cl-filter label="申请时间">
				<cl-date-picker prop="refundApply" type="datetimerange" />
			</cl-filter>

			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索订单号、标题、用户昵称" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" show-summary :summary-method="onSummaryMethod" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 退款 -->
		<cl-form ref="Form" />
	</cl-crud>
</template>

<script lang="ts" name="order-refund" setup>
import { useCrud, useForm, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import OrderUserItem from "../components/user-item.vue";
import OrderLogisticsItem from "../components/logistics-item.vue";
import OrderPayItem from "../components/pay-item.vue";
import OrderRemarkItem from "../components/remark-item.vue";
import OrderInfoItem from "../components/info-item.vue";
import OrderDiscountItem from "../components/discount-item.vue";
import OrderGoods from "../components/goods.vue";

const { service } = useCool();

const options = reactive({
	payType: [
		{ label: "微信", value: 1, color: "#2aae67" },
		{ label: "支付宝", value: 2, color: "1678FF" }
	],
	goods: [] as Array<{ label: string; value: number }>,
	userType: [
		{ label: "真人", value: 0 },
		{ label: "机器人", value: 1 }
	],
	status: [
		{ label: "申请中", value: 0, type: "info" },
		{ label: "已退款", value: 1, type: "success" },
		{ label: "已拒绝", value: 2, type: "danger" }
	]
});

// 合计数据
const subData = ref({
	totalCount: 0,
	totalPrice: 0
});

// cl-table
const Table = useTable({
	contextMenu: [],
	columns: [
		{
			type: "expand",
			label: "商品",
			width: 60,
			component: {
				vm: OrderGoods
			}
		},
		{
			label: "订单信息",
			prop: "orderNum",
			minWidth: 160,
			component: {
				vm: OrderInfoItem
			}
		},
		{
			label: "用户信息",
			prop: "user",
			minWidth: 120,
			component: {
				vm: OrderUserItem
			}
		},
		{
			label: "金额（元）",
			prop: "price",
			minWidth: 120,
			sortable: "custom"
		},
		{
			label: "优惠说明",
			prop: "discount",
			minWidth: 160,
			component: {
				vm: OrderDiscountItem
			}
		},
		{
			label: "付款信息",
			prop: "pay",
			minWidth: 160,
			component: {
				vm: OrderPayItem
			}
		},
		{
			label: "物流信息",
			prop: "logistics",
			minWidth: 250,
			component: {
				vm: OrderLogisticsItem
			}
		},
		{
			label: "备注",
			prop: "remark",
			minWidth: 200,
			component: {
				vm: OrderRemarkItem
			}
		},
		{
			label: "申请时间",
			prop: "refund.applyTime",
			minWidth: 160
		},
		{
			label: "状态",
			prop: "refund",
			dict: options.status,
			formatter(row) {
				return row.refund?.status;
			},
			minWidth: 100,
			fixed: "right"
		},
		{
			type: "op",
			width: 100,
			buttons({ scope }) {
				return [
					{
						label: "退款",
						type: "danger",
						hidden: !(
							service.order.info._permission.refundHandle &&
							scope.row.refund.status == 0
						),
						onClick() {
							toRefund(scope.row);
						}
					}
				];
			}
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.order.info,
		async onRefresh(params, { next }) {
			const res = await next(params);

			// 设置合计数据
			subData.value = res.subData;
		}
	},
	(app) => {
		app.refresh({
			status: [5, 6]
		});
	}
);

function refresh(params?: any) {
	Crud.value?.refresh(params);
}

function onSummaryMethod() {
	return ["合计", "", "", subData.value.totalPrice + " 元"];
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
	} catch (err) {
		console.error(err);
	}
}

// 发起退款
const Form = useForm();

function toRefund(item: Eps.OrderInfoEntity) {
	Form.value?.open({
		title: "发起退款",
		width: "500px",
		props: {
			labelWidth: "80px"
		},
		op: {
			saveButtonText: "提交"
		},
		items: [
			{
				label: "退款状态",
				prop: "action",
				value: 1,
				required: true,
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "同意",
							value: 1
						},
						{
							label: "拒绝",
							value: 0
						}
					]
				}
			},
			{
				label: "拒绝原因",
				prop: "refuseReason",
				required: true,
				hidden({ scope }) {
					return scope.action != 0;
				},
				component: {
					name: "el-input",
					props: {
						type: "textarea",
						rows: 4
					}
				}
			}
		],
		on: {
			submit(data, { done, close }) {
				service.order.info
					.refundHandle({
						...data,
						orderId: item.id,
						amount: item.price
					})
					.then(() => {
						ElMessage.success("操作成功");
						refresh();
						close();
					})
					.catch((err) => {
						ElMessage.error(err.message);
						done();
					});
			}
		}
	});
}

onMounted(async () => {
	await fetchGoods();
});
</script>
