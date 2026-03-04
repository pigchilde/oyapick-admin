<template>
	<div class="cs-chat__wrap">
		<el-badge
			:value="message.unread"
			:hidden="!message.unread"
			v-permission="service.cs.msg.permission.unreadCount"
		>
			<div class="cs-chat__icon" @click="open">
				<cl-svg name="icon-notice" :size="16" />
			</div>
		</el-badge>

		<!-- 弹框 -->
		<cl-dialog
			v-model="visible"
			title="客服会话"
			height="700px"
			width="1200px"
			padding="0"
			keep-alive
			:scrollbar="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:controls="['slot-expand', 'cl-flex1', 'fullscreen', 'close']"
			@close="onClose"
		>
			<div
				class="cs-chat"
				:class="{
					'is-mini': browser.isMini,
					'is-expand': tools.isExpand
				}"
			>
				<div class="cs-chat__left">
					<cs-session />
				</div>

				<div class="cs-chat__right">
					<cs-message />
				</div>
			</div>

			<!-- 展开按钮 -->
			<template #slot-expand>
				<button class="cl-dialog__controls-icon">
					<el-icon @click="tools.expand(true)" v-if="!tools.isExpand">
						<notebook />
					</el-icon>
					<el-icon @click="tools.expand(false)" v-else>
						<arrow-left />
					</el-icon>
				</button>
			</template>
		</cl-dialog>
	</div>
</template>

<script lang="tsx" name="cs-chat" setup>
import { onMounted, ref } from 'vue';
import { useBrowser, useCool } from '/@/cool';
import { Notebook, ArrowLeft } from '@element-plus/icons-vue';
import { useMessage, useSession, useSocket, useTools, useNotice } from '../hooks';
import CsMessage from './message.vue';
import CsSession from './session.vue';
import type { Cs } from '../types';

const { mitt, service } = useCool();
const { browser } = useBrowser();
const socket = useSocket();
const session = useSession();
const message = useMessage();
const tools = useTools();
const notice = useNotice();

// 是否可见
const visible = ref(false);

// 打开
async function open() {
	visible.value = true;

	// 刷新会话
	await session.refresh();
}

// 关闭
function close() {
	visible.value = false;
}

// 关闭
function onClose() {
	message.getUnread();
}

onMounted(() => {
	if (service.cs.msg._permission.unreadCount) {
		// 连接 socket
		socket.connect();

		// 获取未读消息
		message.getUnread();

		// 监听消息
		mitt.on('cs.msg', (data: Cs.Msg) => {
			if (data.sessionId == session.info?.id) {
				message.read(data.id!);
			} else {
				message.unread += 1;
			}

			// 消息通知
			if (!visible.value) {
				notice.create(data, {
					open
				});
			}
		});
	}
});

defineExpose({
	open,
	close
});
</script>

<style lang="scss">
.cs-chat {
	display: flex;
	justify-content: flex-end;
	background-color: #eee;
	padding: 5px;
	box-sizing: border-box;
	position: relative;
	color: #000;
	height: 100%;

	&__icon {
		padding: 0 5px;
		text-align: center;

		&:hover {
			color: var(--color-primary);
		}
	}

	&__footer {
		padding: 9px 0;
	}

	&__left {
		height: calc(100% - 10px);
		width: 345px;
		position: absolute;
		left: 5px;
		top: 5px;
	}

	&__right {
		position: relative;
		z-index: 99;
		transition: width 0.3s;
		width: 100%;
	}

	&.is-mini {
		.cs-chat__right {
			width: 100% !important;
		}

		&.is-expand {
			.cs-chat__left {
				width: calc(100% - 10px);
				z-index: 100;
			}
		}
	}

	&.is-expand {
		.cs-chat__right {
			width: calc(100% - 350px);
		}
	}
}
</style>
