<template>
  <cl-crud ref="Crud">
    <cl-row>
      <!-- 刷新按钮 -->
      <cl-refresh-btn />

      <cl-filter label="支付方式">
        <cl-select :options="options.payType" prop="payType" :width="140" />
      </cl-filter>

      <cl-filter label="订单状态">
        <cl-select :options="options.status" prop="status" :width="140" />
      </cl-filter>

      <cl-filter label="商品ID">
        <cl-select
          :options="options.goods"
          prop="goodsId"
          :width="220"
          clearable
          filterable
          placeholder="请选择商品"
        />
      </cl-filter>

      <cl-filter label="用户类型">
        <cl-select :options="options.userType" prop="isRobot" :width="140" clearable />
      </cl-filter>

      <cl-filter label="创建时间">
        <cl-date-picker type="datetimerange" />
      </cl-filter>

      <cl-flex1 />
      <!-- 关键字搜索 -->
      <cl-search-key placeholder="搜索订单号、标题、用户昵称" />
    </cl-row>

    <cl-row>
      <!-- 数据表格 -->
      <cl-table ref="Table" show-summary :summary-method="onSummaryMethod" />
    </cl-row>

    <cl-row>
      <cl-flex1 />
      <!-- 分页控件 -->
      <cl-pagination />
    </cl-row>
  </cl-crud>
</template>

<script lang="ts" name="order-info" setup>
import { useCrud, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { onMounted, reactive, ref } from "vue";
import { LotteryPickupStatus, OrderStatus, PayType } from "../dict";
import OrderUserItem from "../components/user-item.vue";
import OrderLogisticsItem from "../components/logistics-item.vue";
import OrderPayItem from "../components/pay-item.vue";
import OrderRemarkItem from "../components/remark-item.vue";
import OrderInfoItem from "../components/info-item.vue";
import OrderDiscountItem from "../components/discount-item.vue";
import OrderGoods from "../components/goods.vue";

const { service } = useCool();

// 选项
const options = reactive({
  payType: PayType,
  status: OrderStatus,
  lotteryPickupStatus: LotteryPickupStatus,
  goods: [] as Array<{ label: string; value: number }>,
  userType: [
    { label: "真人", value: 0 },
    { label: "机器人", value: 1 },
  ],
});

// 合计数据
const subData = ref({
  totalCount: 0,
  totalPrice: 0,
});

// cl-table
const Table = useTable<Eps.OrderInfoEntity>({
  contextMenu: ["delete"],
  columns: [
    {
      type: "expand",
      label: "商品",
      width: 60,
      component: {
        vm: OrderGoods,
      },
    },
    {
      label: "订单信息",
      prop: "orderNum",
      minWidth: 160,
      component: {
        vm: OrderInfoItem,
      },
    },
    {
      label: "用户信息",
      prop: "user",
      minWidth: 120,
      component: {
        vm: OrderUserItem,
      },
    },
    {
      label: "金额（元）",
      prop: "price",
      minWidth: 120,
      sortable: "custom",
    },
    {
      label: "优惠说明",
      prop: "discount",
      minWidth: 160,
      component: {
        vm: OrderDiscountItem,
      },
    },
    {
      label: "付款信息",
      prop: "pay",
      minWidth: 160,
      component: {
        vm: OrderPayItem,
      },
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 200,
      component: {
        vm: OrderRemarkItem,
      },
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      sortable: "desc",
    },
    {
      label: "领奖状态",
      prop: "lotteryPickupStatus",
      dict: options.lotteryPickupStatus,
      minWidth: 130,
      fixed: "right",
    },
    {
      label: "状态",
      prop: "status",
      dict: options.status,
      minWidth: 100,
      fixed: "right",
    },
  ],
});

// cl-crud
const Crud = useCrud(
  {
    service: service.order.info,
    async onRefresh(params, { next, render }) {
      const res = await next(params);
      const list = Array.isArray(res?.list)
        ? res.list
        : Array.isArray(res?.rows)
          ? res.rows
          : [];
      const pagination =
        res?.pagination ||
        (res?.total !== undefined
          ? {
              page: params?.page || 1,
              size: params?.size || 20,
              total: res.total,
            }
          : undefined);

      // 设置合计数据
      subData.value = res?.subData || {
        totalCount: 0,
        totalPrice: 0,
      };

      render(list, pagination);
    },
  },
  (app) => {
    app.refresh();
  },
);

async function fetchGoods() {
  try {
    const size = 500;
    let page = 1;
    const allGoods: any[] = [];

    while (true) {
      const res = await service.goods.info.page({ page, size });
      const list = Array.isArray(res?.list) ? res.list : [];
      allGoods.push(...list);

      if (list.length < size) {
        break;
      }
      page += 1;
    }

    options.goods = allGoods.map((g: any) => ({
      label: `${g.id} - ${g.title}`,
      value: g.id,
    }));
  } catch (err) {
    console.error(err);
  }
}

function onSummaryMethod() {
  return ["合计", "", "", subData.value.totalPrice + " 元"];
}

onMounted(async () => {
  await fetchGoods();
});
</script>
