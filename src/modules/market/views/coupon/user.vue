<template>
	<cl-crud ref="Crud">
		<cl-view-head />

		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索用户昵称" />
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

<script lang="ts" name="market-coupon-user" setup>
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { reactive } from 'vue';
import UserSelect from '/$/user/components/user-select.vue';

const { service, route, refs, setRefs } = useCool();

const options = reactive({
	status: [
		{ label: '未使用', value: 0, type: 'info' },
		{ label: '已使用', value: 1, type: 'success' }
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: '600px'
	},
	items: [
		{
			label: '选择用户',
			prop: 'userId',
			component: {
				vm: UserSelect,
				ref: setRefs('userSelect'),
				props: {
					multiple: false
				}
			},
			required: true
		},
		{
			label: '状态',
			prop: 'status',
			component: {
				name: 'el-radio-group',
				options: options.status
			},
			value: 0,
			required: true
		}
	],
	onOpened(data) {
		if (Upsert.value?.mode != 'add') {
			service.user.info
				.info({
					id: data.userId
				})
				.then(res => {
					refs.userSelect.select(res);
				});
		}
	},
	onSubmit(data, { next }) {
		next({
			...data,
			couponId: route.query.id
		});
	}
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: '用户昵称', prop: 'nickName', minWidth: 140 },
		{
			label: '状态',
			prop: 'status',
			dict: options.status,
			minWidth: 120
		},
		{ label: '使用时间', prop: 'useTime', minWidth: 160, sortable: 'custom' },
		{
			label: '创建时间',
			prop: 'createTime',
			minWidth: 160,
			sortable: 'desc'
		},
		{ type: 'op', buttons: ['edit', 'delete'] }
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.market.coupon.user
	},
	app => {
		app.refresh({
			couponId: route.query.id
		});
	}
);
</script>
