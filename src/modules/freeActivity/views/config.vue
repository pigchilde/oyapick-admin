<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-flex1 />
			<el-button type="primary" :loading="saving" @click="save">保存配置</el-button>
			<el-button @click="load">刷新</el-button>
		</cl-row>

		<cl-row>
			<el-form label-width="160px" :model="form" style="max-width: 900px; padding: 20px 0">
				<el-form-item label="活动开关">
					<el-switch v-model="form.enabled" :active-value="1" :inactive-value="0" />
				</el-form-item>
				<el-form-item label="活动名称">
					<el-input v-model="form.name" clearable />
				</el-form-item>
				<el-form-item label="活动时间">
					<el-date-picker
						v-model="activityTimeRange"
						type="datetimerange"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						format="YYYY-MM-DD HH:mm:ss"
						value-format="YYYY-MM-DD HH:mm:ss"
					/>
				</el-form-item>
				<el-form-item label="时区">
					<el-input v-model="form.timezone" />
				</el-form-item>
				<el-form-item label="领取窗口">
					<div class="slot-list">
						<div v-for="slot in form.claimSlots" :key="slot.key" class="slot-row">
							<el-input v-model="slot.key" placeholder="key" />
							<el-time-picker
								v-model="slot.time"
								format="HH:mm"
								value-format="HH:mm"
								placeholder="时间"
							/>
							<el-input-number v-model="slot.windowMinutes" :min="1" :max="1440" />
							<el-input-number v-model="slot.quota" :min="1" :max="100" />
						</div>
					</div>
				</el-form-item>
				<el-form-item label="首页提示">
					<el-input v-model="form.homeTip" type="textarea" :rows="2" />
				</el-form-item>
				<el-form-item label="领取成功提示">
					<el-input v-model="form.claimSuccessMessage" type="textarea" :rows="2" />
				</el-form-item>
			</el-form>
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" name="free-activity-config" setup>
import { useCrud } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useFreeActivityService } from '../service';

const { service } = useCool();
const freeActivityService = useFreeActivityService(service);

interface ClaimSlot {
	key: string;
	time: string;
	windowMinutes: number;
	quota: number;
}

interface FreeActivityConfigForm {
	name: string;
	enabled: number;
	startTime: string;
	endTime: string;
	timezone: string;
	claimSlots: ClaimSlot[];
	homeTip: string;
	claimSuccessMessage: string;
}

const saving = ref(false);
const form = reactive<FreeActivityConfigForm>({
	name: '每日免费抽奖次数',
	enabled: 0,
	startTime: '',
	endTime: '',
	timezone: 'Africa/Lagos',
	claimSlots: [
		{ key: 'morning', time: '09:00', windowMinutes: 60, quota: 1 },
		{ key: 'noon', time: '13:00', windowMinutes: 60, quota: 1 },
		{ key: 'evening', time: '18:00', windowMinutes: 60, quota: 1 }
	],
	homeTip: '',
	claimSuccessMessage: ''
});

const activityTimeRange = computed({
	get() {
		return form.startTime && form.endTime ? [form.startTime, form.endTime] : [];
	},
	set(value: string[]) {
		form.startTime = value?.[0] || '';
		form.endTime = value?.[1] || '';
	}
});

const Crud = useCrud(
	{
		service: freeActivityService.config
	},
	() => {}
);

async function load() {
	const res = await freeActivityService.config.info();
	Object.assign(form, {
		...res,
		claimSlots: Array.isArray(res?.claimSlots) ? res.claimSlots : form.claimSlots
	});
}

async function save() {
	try {
		saving.value = true;
		await freeActivityService.config.update(form);
		ElMessage.success('保存成功');
		await load();
	} finally {
		saving.value = false;
	}
}

onMounted(load);
</script>

<style lang="scss" scoped>
.slot-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.slot-row {
	display: grid;
	grid-template-columns: 140px 160px 160px 140px;
	gap: 12px;
	align-items: center;
}
</style>
