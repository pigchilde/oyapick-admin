<template>
	<div class="order-goods">
		<div class="list">
			<div class="goods" v-for="goods in list" :key="goods.id">
				<p class="name">{{ goods.name }}</p>

				<div class="specs">
					<div class="item" v-for="item in goods.children" :key="item.id">
						<cl-image :src="item.cover" :size="60" />

						<div class="det">
							<p class="name">{{ item.spec.name }}</p>
							<p class="flex1"></p>
							<p class="price">
								<span>¥{{ item.spec.price }}</span>
								<span>x{{ item.count }}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="order-goods">
import { isEmpty } from "lodash-es";
import { PropType, computed } from "vue";

interface Item {
	id: number;
	name: string;
	children: Eps.GoodsInfoEntity[];
}

const props = defineProps({
	scope: {
		type: Object as PropType<Eps.OrderInfoEntity & { goodsList?: any[] }>,
		default: () => ({})
	}
});

const list = computed(() => {
	const arr: Item[] = [];

	props.scope.goodsList
		?.filter((e) => !!e)
		.forEach((e) => {
			// 封面图
			let pics = e.spec.images || [];
			if (isEmpty(pics)) {
				pics = [e.goodsInfo.mainPic];
			}
			e.cover = pics[0];

			const d = arr.find((a) => a.id == e.goodsInfo.id);

			if (d) {
				d.children?.push(e);
			} else {
				arr.push({
					id: e.goodsInfo.id!,
					name: e.goodsInfo.title!,
					children: [e]
				});
			}
		});

	return arr;
});
</script>

<style lang="scss" scoped>
.order-goods {
	.list {
		display: flex;
		flex-wrap: wrap;

		.goods {
			margin-left: 10px;

			& > .name {
				font-size: 14px;
				margin-bottom: 5px;
				padding: 0 2px;
				height: 20px;
				max-width: 200px;
				box-sizing: border-box;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
			}

			.specs {
				display: flex;
			}

			.item {
				display: flex;
				align-items: center;
				font-size: 12px;
				position: relative;
				border: 1px solid var(--el-bg-color-page);
				border-radius: 6px;
				padding: 10px;
				height: 80px;
				width: 250px;
				margin-right: 10px;

				.cl-image {
					margin-right: 10px;
					border-radius: 6px;
					overflow: hidden;
				}

				.det {
					display: flex;
					flex-direction: column;
					flex: 1;
					height: 100%;
					padding: 2px 0;

					.name {
						overflow: hidden;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}

					.flex1 {
						flex: 1;
					}

					.price {
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
				}
			}
		}
	}
}
</style>
