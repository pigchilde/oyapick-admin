<template>
	<el-scrollbar>
		<div class="view-home">
			<el-row :gutter="15">
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<count-user />
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<count-category />
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<count-paid />
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<count-effect />
					</div>
				</el-col>
			</el-row>

			<div class="card">
				<tab-chart />
			</div>

			<div class="card card--last">
				<goods-rank />
			</div>
		</div>
	</el-scrollbar>
</template>

<script lang="ts" name="home" setup>
import CountCategory from "./components/count-category.vue";
import CountUser from "./components/count-user.vue";
import CountPaid from "./components/count-paid.vue";
import CountEffect from "./components/count-effect.vue";
import TabChart from "./components/tab-chart.vue";
import GoodsRank from "./components/goods-rank.vue";
</script>

<style lang="scss">
.view-home {
	overflow-x: hidden;

	.card {
		background-color: #fff;
		border-radius: 6px;
		margin-bottom: 15px;
		font-size: 12px;
		letter-spacing: 0.5px;
		color: #000;
		line-height: 1;

		&__header {
			display: flex;
			align-items: center;
			height: 50px;
			padding: 0 20px;
			position: relative;

			.label {
				font-size: 12px;
			}

			.value {
				font-size: 18px;
				font-weight: bold;
				margin-left: 10px;
			}

			.more {
				position: absolute;
				right: 15px;
				z-index: 9;
				cursor: pointer;

				&:hover {
					color: var(--el-color-primary);
				}
			}
		}

		&__container {
			padding: 0 20px;
			height: 50px;
		}

		&__footer {
			display: flex;
			align-items: center;
			height: 50px;
			border-top: 1px solid #f7f7f7;
			font-size: 12px;
			margin: 0 5px;
			padding: 0 15px;
			box-sizing: border-box;

			.label {
				margin-right: 10px;
			}

			.value {
				font-size: 14px;
			}
		}
	}
}
</style>
