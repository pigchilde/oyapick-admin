<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-flex1 />
			<el-button type="primary" :loading="saving" @click="save">保存配置</el-button>
			<el-button @click="load">刷新</el-button>
		</cl-row>

		<cl-row>
			<el-form label-width="160px" :model="form" style="max-width: 800px; padding: 20px 0">
				<el-form-item label="全局分销开关">
					<el-switch v-model="form.enabled" :active-value="1" :inactive-value="0" />
				</el-form-item>
				<el-form-item label="默认佣金比例(bp)">
					<el-input-number v-model="form.defaultRateBp" :min="0" :max="10000" />
					<span style="margin-left: 10px; color: #909399">
						当前：{{ ratePercentText }}，100 = 1%
					</span>
				</el-form-item>
				<el-form-item label="最低提现金额">
					<el-input-number v-model="form.minWithdrawAmount" :min="0" :precision="2" />
				</el-form-item>
				<el-form-item label="提现手续费类型">
					<el-radio-group v-model="form.withdrawFeeType">
						<el-radio :label="0">比例</el-radio>
						<el-radio :label="1">固定</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手续费值">
					<el-input-number v-model="form.withdrawFeeValue" :min="0" :precision="2" />
				</el-form-item>
				<el-form-item label="结算冻结分钟">
					<el-input-number v-model="form.settlementFreezeMinutes" :min="0" :max="43200" />
				</el-form-item>
				<el-form-item label="分销协议">
					<el-input v-model="form.agreementContent" type="textarea" :rows="8" />
				</el-form-item>
			</el-form>
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" name="distribution-config" setup>
import { useCrud } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

const { service } = useCool();

interface DistributionConfigForm {
	enabled: number;
	defaultRateBp: number;
	minWithdrawAmount: number;
	withdrawFeeType: number;
	withdrawFeeValue: number;
	settlementFreezeMinutes: number;
	agreementContent: string;
}

const saving = ref(false);
const form = reactive<DistributionConfigForm>({
	enabled: 0,
	defaultRateBp: 200,
	minWithdrawAmount: 100,
	withdrawFeeType: 0,
	withdrawFeeValue: 0,
	settlementFreezeMinutes: 0,
	agreementContent: ''
});

const ratePercentText = computed(() => `${(Number(form.defaultRateBp || 0) / 100).toFixed(2)}%`);

// cl-crud (用于保持页面风格统一)
const Crud = useCrud(
	{
		service: service.distribution.config
	},
	() => {}
);

async function load() {
	const res = await service.distribution.config.info();
	Object.assign(form, res || {});
}

async function save() {
	try {
		saving.value = true;
		await service.distribution.config.update(form);
		ElMessage.success('保存成功');
		await load();
	} finally {
		saving.value = false;
	}
}

onMounted(load);
</script>
