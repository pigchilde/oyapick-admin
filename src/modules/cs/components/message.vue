<template>
	<div
		class="cs-message"
		v-loading="message.loading"
		element-loading-text="加载中"
		v-if="session.info"
	>
		<!-- 头部 -->
		<div class="head">
			<div class="avatar">
				<cl-avatar :size="30" shape="square" :src="session.info?.avatarUrl" />
			</div>
			<span class="name">与“{{ session.info?.nickName }}”聊天中</span>
		</div>

		<!-- 消息列表 -->
		<el-scrollbar class="scrollbar" :ref="setRefs('scrollbar')" @scroll="onScroll">
			<div class="list">
				<ul
					v-for="(d, n) in message.list"
					:key="d.id"
					:class="{
						'is-show': message.list.length - n <= pagination.page
					}"
				>
					<li v-for="(item, index) in d.data" :key="index">
						<div class="date" v-if="item.date">
							<span>{{ item.date }}</span>
						</div>

						<div
							class="item"
							:class="{
								'is-right': item.type == 1
							}"
						>
							<div class="avatar">
								<cl-avatar :size="36" shape="square" :src="item.avatarUrl" />
							</div>

							<div
								class="det"
								@contextmenu="
									(e) => {
										onContextMenu(e, item);
									}
								"
							>
								<div class="h">
									<span class="name">{{ item.nickName }}</span>
								</div>

								<div class="content">
									<!-- 文本 -->
									<div class="text" v-if="item.content.type == 'text'">
										<span>{{ item.content.data }}</span>
									</div>

									<!-- 图片 -->
									<div class="image" v-else-if="item.content.type == 'image'">
										<el-image
											:src="item.content.data"
											:preview-src-list="[item.content.data]"
											:initial-index="item._index"
											scroll-container=".cs-message .list"
										>
											<template #error>
												<div class="error">图片加载失败</div>
											</template>
										</el-image>
									</div>

									<!-- 表情 -->
									<div
										class="emoji text"
										v-else-if="item.content.type == 'emoji'"
									>
										<img :src="getEmoji(item.content.data)" />
									</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>

			<div class="empty" v-if="message.list.length == 0">
				<el-empty :image-size="100" description="暂无消息" />
			</div>
		</el-scrollbar>

		<!-- 底部 -->
		<div class="footer">
			<div class="tools">
				<ul>
					<cl-upload
						type="file"
						:show-file-list="false"
						accept="image/*"
						@success="onImageSend"
					>
						<li>
							<el-icon>
								<icon-picture />
							</el-icon>
						</li>
					</cl-upload>

					<li @click="refs.uploadSpace.open()">
						<el-icon>
							<folder />
						</el-icon>
					</li>

					<tools-emoji>
						<li>
							<el-icon>
								<star />
							</el-icon>
						</li>
					</tools-emoji>
				</ul>
			</div>

			<div class="input">
				<el-input
					v-model="content"
					type="textarea"
					placeholder="请输入..."
					:rows="4"
					resize="none"
					:autosize="{
						minRows: 4,
						maxRows: 10
					}"
					@keydown="onKeydown"
				/>
				<el-button type="success" :disabled="!content" @click="onTextSend">发送</el-button>
			</div>
		</div>

		<!-- 文件空间 -->
		<cl-upload-space
			:ref="setRefs('uploadSpace')"
			:show-btn="false"
			accept="image/*"
			@confirm="onFileConfirm"
		/>
	</div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref, watch } from "vue";
import { Picture as IconPicture, Folder, Star } from "@element-plus/icons-vue";
import { ContextMenu } from "@cool-vue/crud";
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { useSession, useSocket, useMessage } from "../hooks";
import { useCool } from "/@/cool";
import ToolsEmoji from "./tools/emoji.vue";
import { getEmoji } from "../utils";
import type { Cs } from "../types";

const { refs, setRefs } = useCool();
const { copy } = useClipboard();
const socket = useSocket();
const session = useSession();
const message = useMessage();

// 分页
const pagination = reactive({
	page: 1
});

// 输入
const content = ref("");

// 加载中
const loading = ref(false);

// 按下
function onKeydown(e: KeyboardEvent) {
	if (e.key == "Enter" && !e.shiftKey) {
		onTextSend();
		e.preventDefault();
	}
}

// 文本消息
function onTextSend() {
	if (content.value) {
		socket.send({
			type: "text",
			data: content.value
		});

		content.value = "";
	}
}

// 图片消息
function onImageSend(res: { url: string }) {
	socket.send({
		type: "image",
		data: res.url
	});
}

// 右键菜单
function onContextMenu(e: Event, item: Cs.Msg) {
	ContextMenu.open(e, {
		hover: {
			target: "content"
		},
		list: [
			{
				label: "复制",
				callback(done) {
					copy(item.content.data || "");
					ElMessage.success("复制成功");
					done();
				}
			}
		]
	});
}

// 文件选择
function onFileConfirm(selection: any[]) {
	selection.forEach(onImageSend);
}

// 获取高度
function getHeight(): Promise<number> {
	return new Promise((resolve) => {
		resolve(document.querySelector(".cs-message .list")?.clientHeight || 0);
	});
}

// 滚动到指定位置
function scrollTo(top: number, smooth?: string) {
	nextTick(() => {
		refs.scrollbar?.wrapRef?.scroll({
			top,
			behavior: smooth ? "smooth" : "auto"
		});
	});
}

// 滚动到底部
function scrollToBottom() {
	scrollTo(99999 + Math.random(), "smooth");
}

// 滚动到顶部
async function scrollToUpper() {
	if (pagination.page > message.list.length) {
		return false;
	}

	loading.value = true;

	// 计算当前的高度
	const h1 = await getHeight();

	// 预加载下一页
	await message.refresh({
		page: pagination.page + 1
	});

	// 下一页
	pagination.page += 1;

	// 延迟
	await nextTick();

	// 计算页数增加后的高度
	const h2 = await getHeight();

	// 滚动到指定位置
	scrollTo(h2 - h1);

	loading.value = false;
}

// 滚动事件
function onScroll(e: { scrollTop: number }) {
	if (e.scrollTop == 0) {
		scrollToUpper();
	}
}

function toDev() {
	ElMessage.info("暂未开放");
}

watch(
	() => session.info?.id,
	async () => {
		// 重置分页
		pagination.page = 1;

		// 获取未读数
		message.getUnread();

		// 获取消息列表
		await message.refresh(pagination);

		// 滚动到底
		scrollToBottom();
	}
);
</script>

<style lang="scss" scoped>
.cs-message {
	display: flex;
	flex-direction: column;
	background-color: #fff;
	border-radius: 6px;
	height: 100%;
	box-sizing: border-box;

	.head {
		display: flex;
		align-items: center;
		height: 50px;
		padding: 0 10px;

		.name {
			margin-left: 10px;
			font-size: 14px;
		}

		ul {
			li {
				list-style: none;
			}
		}
	}

	.scrollbar {
		flex: 1;
		background-color: #f7f7f7;

		.list {
			ul {
				opacity: 0;
				height: 0;
				overflow: hidden;
				transition: all 0.3s;

				&.is-show {
					height: auto;
					opacity: 1;
				}

				& > li {
					list-style: none;

					.date {
						margin: 10px;
						text-align: center;

						span {
							background-color: #c9c9c9;
							padding: 5px;
							border-radius: 4px;
							color: #fff;
							font-size: 12px;
						}
					}

					.item {
						display: flex;
						padding: 10px;

						.avatar {
							margin-right: 10px;
						}

						.det {
							.h {
								display: flex;
								align-items: center;
								.name {
									font-size: 12px;
									color: #666;
								}
							}

							.content {
								display: flex;
								margin-top: 5px;

								.text {
									display: inline-block;
									background-color: #fff;
									padding: 8px;
									border-radius: 0 6px 6px 6px;
									max-width: 400px;
									font-size: 14px;
								}

								.image {
									.el-image {
										display: block;
										height: 200px;
										border-radius: 4px;
									}

									.error {
										display: flex;
										justify-content: center;
										align-items: center;
										height: 200px;
										width: 200px;
										background-color: #fff;
										border-radius: 8px;
										letter-spacing: 1px;
										line-height: 1;
										color: var(--el-color-danger);
										font-size: 13px;
									}
								}

								.emoji {
									img {
										display: block;
										height: 22px;
									}
								}
							}
						}

						&.is-right {
							flex-direction: row-reverse;

							.avatar {
								margin-left: 10px;
								margin-right: 0;
							}

							.det {
								.h,
								.content {
									flex-direction: row-reverse;
								}

								.content {
									.text {
										border-radius: 6px 0 6px 6px;
										background-color: var(--el-color-primary);
										color: #fff;
									}
								}
							}
						}
					}
				}
			}

			:deep(.el-scrollbar__view) {
				height: 100%;
			}

			.empty {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
			}
		}
	}

	.footer {
		padding: 10px;

		.tools {
			display: flex;
			margin-bottom: 10px;

			ul {
				display: flex;
				align-items: center;
				flex: 1;

				li {
					height: 26px;
					width: 26px;
					border-radius: 4px;
					margin-right: 10px;
					list-style: none;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;
					font-size: 18px;
					position: relative;

					&:hover {
						background-color: #f7f7f7;
					}
				}
			}
		}

		.input {
			display: flex;
			position: relative;

			:deep(.el-textarea__inner) {
				box-shadow: none;
				padding: 0 5px;
			}

			.el-button {
				margin-left: 10px;
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
	}
}
</style>
