<template>
	<div class="logistics-item">
		<div class="row">
			<span>联系电话：</span>

			<span>{{ scope.address.phone }}（{{ scope.address.contact }}）</span>
		</div>

		<div class="row">
			<span>所在地区：</span>

			<span>
				{{ scope.address.province }}{{ scope.address.city }}{{ scope.address.district }}
			</span>
		</div>

		<div class="row">
			<span>详细地址：</span>

			<span>
				{{ scope.address.address }}
			</span>
		</div>

		<div class="btns" v-if="scope.status != 0">
			<el-button size="small" @click="toDeliver()" v-if="[1, 2].includes(scope.status!)">{{
				scope.status == 1 ? "发货" : "编辑"
			}}</el-button>

			<el-button size="small" @click="open" v-if="scope.logistics">查看物流</el-button>
		</div>

		<!-- 发货 -->
		<cl-form ref="Form" />

		<!-- 物流信息 -->
		<cl-dialog v-model="visible" title="物流信息" height="60vh">
			<div class="info" v-loading="loading">
				<template v-if="info?.expName">
					<el-descriptions :column="1" :style="{ marginBottom: '10px' }">
						<el-descriptions-item label="快递名称：">{{
							info?.expName
						}}</el-descriptions-item>
						<el-descriptions-item label="物流单号：">{{
							info?.number
						}}</el-descriptions-item>
					</el-descriptions>

					<el-timeline>
						<el-timeline-item
							v-for="(item, index) in info?.list"
							:key="index"
							hollow
							:timestamp="item.time"
						>
							{{ item.status }}
						</el-timeline-item>
					</el-timeline>
				</template>

				<el-empty :image-size="80" description="暂无物流信息" v-else />
			</div>
		</cl-dialog>
	</div>
</template>

<script lang="ts" setup name="order-logistics-item">
import { useForm } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { PropType, ref } from "vue";
import { ElMessage } from "element-plus";
import { useDict } from "/$/dict";
import { isString } from "lodash-es";

const props = defineProps({
	scope: {
		type: Object as PropType<Eps.OrderInfoEntity>,
		default: () => ({})
	},
	disabled: Boolean
});

const { service } = useCool();
const { dict } = useDict();
const Form = useForm();

// 物流信息
const info = ref<{
	expName: string;
	number: string;
	list: {
		time: string;
		status: string;
	}[];
}>();

// 是否可见
const visible = ref(false);

// 信息加载中
const loading = ref(false);

// 查看物流
async function open() {
	visible.value = true;
	loading.value = true;

	await service.order.info
		.logistics({
			orderId: props.scope.id
		})
		.then((res) => {
			info.value = undefined;

			if (isString(res)) {
				ElMessage.error(res);
			} else {
				info.value = res;
			}
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});

	loading.value = false;
}

// 发货
function toDeliver() {
	const { num, company } = props.scope.logistics || {};
	const isEdit = props.scope.status != 1;

	Form.value?.open({
		title: isEdit ? "编辑单号" : "订单发货",
		width: "500px",
		props: {
			labelPosition: "top"
		},
		form: {
			num,
			company
		},
		items: [
			{
				label: "物流公司",
				prop: "company",
				required: true,
				component: {
					name: "el-select",
					options: dict.get("logisticsCompany"),
					props: {
						filterable: true
					}
				}
			},
			{
				label: "物流单号",
				prop: "num",
				required: true,
				component: {
					name: "el-input",
					props: {
						clearable: true
					}
				}
			}
		],
		on: {
			submit(data, { close, done }) {
				if (data.company == "sf") {
					if (!data.num.includes(":")) {
						data.num += `:${props.scope.address.phone.slice(-4)}`;
					}
				}

				service.order.info[isEdit ? "update" : "deliver"]({
					[isEdit ? "id" : "orderId"]: props.scope.id,
					logistics: data
				})
					.then(() => {
						ElMessage.success("保存成功");
						close();

						// 更新状态为待收货
						props.scope.status = 2;

						// 更新物流信息
						props.scope.logistics = data;
					})
					.catch((err) => {
						ElMessage.error(err.message);
						done();
					});
			}
		}
	});
}
</script>

<style lang="scss" scoped>
.logistics-item {
	text-align: left;
	font-size: 12px;
	position: relative;

	.icon {
		position: absolute;
		right: -5px;
		top: 0;
		cursor: pointer;
		font-size: 16px;
		color: var(--el-color-danger);
	}

	.row {
		display: flex;

		& > span {
			&:first-child {
				flex-shrink: 0;
			}
		}
	}

	.btns {
		margin-top: 4px;
	}
}
</style>
