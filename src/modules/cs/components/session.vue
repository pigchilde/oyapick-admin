<template>
	<div class="cs-session">
		<div class="head">
			<el-input :prefix-icon="Search" v-model="keyWord" placeholder="搜索" clearable />

			<ul class="tools">
				<li @click="session.refresh()">
					<el-icon><refresh /></el-icon>
				</li>
			</ul>
		</div>

		<div class="container" v-loading="session.loading">
			<el-scrollbar class="scroller" :ref="setRefs('scroller')">
				<div
					class="list"
					v-infinite-scroll="onMore"
					:infinite-scroll-immediate="false"
					:infinite-scroll-disabled="session.loaded"
				>
					<div
						class="item"
						v-for="(item, index) in flist"
						:key="index"
						:class="{
							'is-active': item.id == session.info?.id
						}"
						@click="toDetail(item)"
					>
						<div class="avatar">
							<el-badge
								:value="item.adminUnreadCount"
								:hidden="item.adminUnreadCount == 0"
							>
								<cl-avatar shape="square" :src="item.avatarUrl" />
							</el-badge>
						</div>

						<div class="det">
							<p class="name">{{ item.nickName }}</p>
							<p class="message">
								{{ msgFormatter(item.lastMsg) }}
							</p>
						</div>

						<div class="status">
							<p class="date">{{ dateFormatter(item.updateTime) }}</p>
						</div>
					</div>
				</div>

				<el-empty v-if="flist.length == 0" :image-size="100" description="暂无会话" />
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";
import { Refresh, Search } from "@element-plus/icons-vue";
import { useBrowser, useCool } from "/@/cool";
import { useDialog } from "@cool-vue/crud";
import { useSession, useTools } from "../hooks";
import { msgFormatter, dateFormatter } from "../utils/index";

const { browser } = useBrowser();
const { refs, setRefs } = useCool();
const session = useSession();
const tools = useTools();

useDialog({
	onFullscreen() {
		nextTick(() => {
			refs.scroller?.update();
		});
	}
});

// 关键字
const keyWord = ref("");

// 过滤列表
const flist = computed(() => session.list.filter((e) => e.nickName?.includes(keyWord.value)) || []);

// 会话详情
async function toDetail(item: Eps.CsSessionEntity) {
	// 设置为会话
	session.set(item);

	// 收起
	if (browser.isMini) {
		tools.expand(false);
	}
}

// 加载更多
function onMore() {
	session.refresh({
		page: session.pagination.page + 1
	});
}
</script>

<style lang="scss" scoped>
.cs-session {
	height: 100%;
	width: 100%;
	background-color: #fff;
	border-radius: 6px;

	.head {
		display: flex;
		border-bottom: 1px solid #f7f7f7;
		padding: 10px;

		:deep(.el-input) {
			height: 30px;

			.el-input__wrapper {
				background-color: #eee;
				box-shadow: none;
			}
		}

		.tools {
			display: inline-flex;
			align-items: center;

			li {
				height: 30px;
				width: 30px;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				margin-left: 10px;
				border-radius: 4px;
				background-color: #eee;
				color: #666;

				.el-icon {
					font-size: 16px;
				}

				&:hover {
					background-color: #ddd;
				}
			}
		}
	}

	.container {
		height: calc(100% - 51px);
		overflow: hidden;

		.scroller {
			height: 100%;
		}

		.list {
			.item {
				display: flex;
				padding: 15px 10px;
				cursor: pointer;

				.avatar {
					margin-right: 10px;

					:deep(.el-badge__content) {
						transform: translateY(-50%) translateX(calc(100% - 5px)) scale(0.8) !important;
					}
				}

				.det {
					flex: 1;

					.name,
					.message {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						width: 220px;
						line-height: 1;
					}

					.name {
						font-size: 14px;
						margin: 2px 0 8px 0;
					}

					.message {
						font-size: 12px;
						color: #666;
					}
				}

				.status {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					font-size: 12px;
					flex-shrink: 0;

					.date {
						margin-bottom: 5px;
						color: #999;
					}
				}

				&.is-active {
					background-color: #eee;
				}

				&:not(.is-active):hover {
					background-color: #f7f7f7;
				}
			}
		}
	}
}
</style>
