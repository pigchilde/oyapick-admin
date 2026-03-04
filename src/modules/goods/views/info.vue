<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />

			<cl-filter label="分类">
				<cl-select tree :options="options.type" prop="typeId" all-levels-id :width="140" />
			</cl-filter>

			<cl-filter label="抽奖状态">
				<cl-select :options="options.lotteryStatus" prop="lotteryStatus" :width="140" />
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
		<cl-upsert ref="Upsert" />

		<!-- 提货码核验弹窗 -->
		<el-dialog v-model="verifyDialogVisible" title="提货码核验" width="600px">
			<!-- 输入提货码表单 -->
			<el-form v-if="!verifyResult" :model="verifyForm" label-width="100px">
				<el-form-item label="提货码">
					<el-input v-model="verifyForm.pickupCode" placeholder="请输入提货码" clearable />
				</el-form-item>
			</el-form>

			<!-- 显示验证结果 -->
			<div v-if="verifyResult" class="verify-result">
				<el-descriptions :column="1" border>
					<el-descriptions-item label="商品标题">{{ verifyResult.title }}</el-descriptions-item>
					<el-descriptions-item label="副标题">{{ verifyResult.subTitle }}</el-descriptions-item>
					<el-descriptions-item label="主图">
						<cl-image :src="verifyResult.mainPic" :size="100" />
					</el-descriptions-item>
					<el-descriptions-item label="价格">￥{{ verifyResult.price }}</el-descriptions-item>
					<el-descriptions-item label="中奖码">{{ verifyResult.winningTicketNo }}</el-descriptions-item>
					<el-descriptions-item label="提货码">{{ verifyResult.pickupCode }}</el-descriptions-item>
					<el-descriptions-item label="核销状态">
						<el-tag :type="verifyResult.isPickupVerified === 1 ? 'success' : 'warning'">
							{{ verifyResult.isPickupVerified === 1 ? '已核销' : '未核销' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item v-if="verifyResult.pickupVerifiedAt" label="核销时间">
						{{ verifyResult.pickupVerifiedAt }}
					</el-descriptions-item>
				</el-descriptions>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="verifyDialogVisible = false">取消</el-button>
					<el-button v-if="!verifyResult" type="primary" @click="handleVerifyPickupCode">查询</el-button>
					<el-button v-else-if="verifyResult.isPickupVerified === 0" type="primary" @click="handleConfirmVerify">确认核销</el-button>
					<el-button v-else type="info" disabled>已核销</el-button>
				</span>
			</template>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" name="goods-info" setup>
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { computed, onActivated, reactive, ref } from 'vue';
import { deepTree } from '/@/cool/utils';
import type { Dict } from '/$/dict/types';
import { ElMessage, ElMessageBox } from 'element-plus';

const { service } = useCool();

const options = reactive({
	type: [] as Dict.Item[],
	lotteryStatus: [
		{
			label: '进行中',
			value: 1
		},
		{
			label: '已开奖',
			value: 2
		},
		{
			label: '已取消',
			value: 3
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '1000px'
	},
	items: [
		{
			type: 'tabs',
			props: {
				labels: [
					{
						label: '商品信息',
						value: 'base'
					},
					{
						label: '商品介绍',
						value: 'detail'
					}
				]
			}
		},
		{
			group: 'base',
			label: '分类',
			prop: 'typeId',
			component: {
				name: 'cl-select',
				props: {
					options: computed(() => options.type),
					tree: true
				}
			},
			required: true
		},
		{
			group: 'base',
			label: '标题',
			prop: 'title',
			component: { name: 'el-input', props: { clearable: true } },
			required: true
		},
		{
			group: 'base',
			label: '副标题',
			prop: 'subTitle',
			component: { name: 'el-input', props: { clearable: true, type: 'textarea', rows: 3 } }
		},
		{
			group: 'base',
			label: '主图',
			prop: 'mainPic',
			component: { name: 'cl-upload' },
			required: true
		},
		{
			group: 'base',
			label: '示例图',
			prop: 'pics',
			component: { name: 'cl-upload', props: { multiple: true, draggable: true } }
		},
		{
			group: 'base',
			label: '原价',
			prop: 'was',
			hook: 'number',

			component: {
				name: 'el-input-number',
				props: {
					min: 0.01,
					max: 1000000,
					precision: 2
				}
			},
			required: true
		},
		{
			group: 'base',
			label: '价格',
			prop: 'price',
			hook: 'number',
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 0.01,
					max: 1000000,
					precision: 2
				}
			},
			required: true
		},
		{
			group: 'base',
			label: '总份数',
			prop: 'totalShares',
			hook: 'number',
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 1,
					max: 1000000,
					precision: 0
				}
			},
			required: true
		},

		{
			group: 'base',
			label: '开始时间',
			prop: 'startTime',
			span: 12,
			component: {
				name: 'el-date-picker',
				props: {
					type: 'datetime',
					placeholder: '请选择开始时间',
					format: 'YYYY-MM-DD HH:mm:ss',
					valueFormat: 'YYYY-MM-DD HH:mm:ss'
				}
			},
			required: true
		},
		{
			group: 'base',
			label: '结束时间',
			prop: 'endTime',
			span: 12,
			component: {
				name: 'el-date-picker',
				props: {
					type: 'datetime',
					placeholder: '请选择结束时间',
					format: 'YYYY-MM-DD HH:mm:ss',
					valueFormat: 'YYYY-MM-DD HH:mm:ss'
				}
			},
			required: true
		},
		{
			group: 'base',
			label: '已售份数',
			prop: 'soldCount',
			hook: 'number',
			span: 12,
			component: {
				name: 'el-input-number',
				props: {
					min: 0,
					max: 1000000,
					precision: 0,
					disabled: true
				}
			}
		},
		{
			group: 'base',
			label: '排序',
			prop: 'sortNum',
			span: 12,
			hook: 'number',
			component: { name: 'el-input-number' }
		},
		{
			group: 'base',
			label: '状态',
			prop: 'status',
			flex: false,
			value: 1,
			component: { name: 'cl-switch' },
			required: true
		},
		{
			group: 'detail',
			prop: 'content',
			component: {
				name: 'cl-editor-wang'
			}
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: '分类', prop: 'typeId', minWidth: 160, dict: computed(() => options.type) },
		{ label: '标题', prop: 'title', minWidth: 240 },
		{
			label: '主图',
			prop: 'mainPic',
			minWidth: 100,
			component: { name: 'cl-image', props: { size: 50 } }
		},
		{
			label: '示例图',
			prop: 'pics',
			minWidth: 100,
			component: { name: 'cl-image', props: { size: 50 } }
		},
		{ label: '价格', prop: 'price', minWidth: 100, sortable: 'custom' },
		{ label: '总份数', prop: 'totalShares', minWidth: 100 },
		{ label: '已售份数', prop: 'soldCount', minWidth: 100 },
		{
			label: '抽奖状态',
			prop: 'lotteryStatus',
			minWidth: 100,
			dict: options.lotteryStatus
		},
		{ label: '开始时间', prop: 'startTime', minWidth: 160, sortable: 'custom' },
		{ label: '结束时间', prop: 'endTime', minWidth: 160, sortable: 'custom' },
		{ label: '状态', prop: 'status', minWidth: 100, component: { name: 'cl-switch' } },
		{ label: '排序', prop: 'sortNum', minWidth: 100, sortable: 'desc' },
		{ label: '创建时间', prop: 'createTime', minWidth: 160, sortable: 'custom' },
		{
			label: '更新时间',
			prop: 'updateTime',
			minWidth: 160,
			sortable: 'custom'
		},
		{
			type: 'op',
			width: 260,
			buttons({ scope }) {
				const buttons: any[] = ['edit', 'delete'];

				// 只有进行中的抽奖才显示开奖按钮
				if (scope.row.lotteryStatus === 1) {
					buttons.push({
						label: '开奖',
						type: 'danger',
						onClick() {
							handleDraw(scope.row);
						}
					});
				}

				// 提货码核验按钮 - 只有已开奖且未核销的才显示
				if (scope.row.lotteryStatus === 2 && scope.row.isPickupVerified === 0) {
					buttons.push({
						label: '提货码核验',
						type: 'primary',
						onClick() {
							openVerifyPickupCodeDialog();
						}
					});
				}

				return buttons;
			}
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.goods.info
	},
	app => {
		app.refresh();
	}
);

// 手动开奖
async function handleDraw(row: any) {
	try {
		await ElMessageBox.confirm(
			`确定要对"${row.title}"进行开奖吗？开奖后将随机选出中奖者。`,
			'开奖确认',
			{
				confirmButtonText: '确定开奖',
				cancelButtonText: '取消',
				type: 'warning'
			}
		);

		const result = await service.goods.info.draw({ id: row.id });

		ElMessage.success(`开奖成功！中奖号码：${result.winningTicketNo}`);

		// 刷新列表
		Crud.value?.refresh();
	} catch (error: any) {
		if (error !== 'cancel') {
			ElMessage.error(error.message || '开奖失败');
		}
	}
}

// 提货码核验弹窗状态
const verifyDialogVisible = ref(false);
const verifyForm = reactive({
	pickupCode: ''
});
const verifyResult = ref<any>(null);

// 打开提货码核验弹窗
function openVerifyPickupCodeDialog() {
	verifyForm.pickupCode = '';
	verifyResult.value = null;
	verifyDialogVisible.value = true;
}

// 查询提货码信息
async function handleVerifyPickupCode() {
	if (!verifyForm.pickupCode) {
		ElMessage.warning('请输入提货码');
		return;
	}

	try {
		// 调用查询接口获取提货码对应的商品信息
		const result = await service.goods.info.getByPickupCode({
			pickupCode: verifyForm.pickupCode
		});
		verifyResult.value = result;
	} catch (error: any) {
		ElMessage.error(error.message || '查询提货码失败');
	}
}

// 确认核销
async function handleConfirmVerify() {
	try {
		// 调用核销接口
		await service.goods.info.verifyPickupCode({
			pickupCode: verifyForm.pickupCode
		});

		ElMessage.success('核销成功');
		verifyDialogVisible.value = false;
		Crud.value?.refresh();
	} catch (error: any) {
		ElMessage.error(error.message || '核销失败');
	}
}

// 获取分类
function getTypes() {
	service.goods.type.list().then(res => {
		res.forEach(e => {
			e.label = e.name;
			e.value = e.id;
		});

		options.type = deepTree(res);
	});
}

onActivated(() => {
	getTypes();
});
</script>
