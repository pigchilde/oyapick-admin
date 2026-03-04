# Goods 模块接口文档

## 目录

- [概述](#概述)
- [通用说明](#通用说明)
- [管理后台接口](#管理后台接口)
- [前端接口](#前端接口)
- [数据模型](#数据模型)
- [错误码](#错误码)

---

## 概述

Goods 模块提供商品管理功能。系统中的商品均为抽奖商品类型，支持商品创建、查询、开奖、奖券管理等核心功能。

### 基础路径

- 管理后台接口：`/admin/goods/info`
- 前端接口：`/app/goods/info`

---

## 通用说明

### 请求头

```
Content-Type: application/json
Authorization: Bearer {token}
```

### 响应格式

```json
{
	"code": 1,
	"message": "success",
	"data": {}
}
```

### 分页参数

| 参数名   | 类型   | 必填 | 说明              |
| -------- | ------ | ---- | ----------------- |
| page     | number | 否   | 页码，默认 1      |
| pageSize | number | 否   | 每页数量，默认 10 |

### 分页响应

```json
{
	"list": [],
	"total": 100,
	"page": 1,
	"pageSize": 10,
	"totalPages": 10
}
```

---

## 管理后台接口

### 1. 创建商品

**接口地址：** `POST /admin/goods/info/add`

**是否需要登录：** 是

**请求参数：**

| 参数名      | 类型     | 必填 | 说明                 |
| ----------- | -------- | ---- | -------------------- |
| typeId      | number   | 是   | 商品类型ID           |
| title       | string   | 是   | 商品标题             |
| subTitle    | string   | 否   | 商品副标题           |
| mainPic     | string   | 是   | 主图URL              |
| pics        | string[] | 否   | 图片URL数组          |
| price       | number   | 是   | 单价                 |
| content     | string   | 否   | 商品详情（HTML）     |
| totalShares | number   | 是   | 总份数               |
| startTime   | string   | 是   | 开始时间（ISO 8601） |
| endTime     | string   | 是   | 结束时间（ISO 8601） |

**请求示例：**

```json
{
	"typeId": 1,
	"title": "iPhone 15 Pro 抽奖",
	"subTitle": "最新款 iPhone 等你来抽",
	"mainPic": "https://example.com/image.jpg",
	"pics": ["https://example.com/1.jpg", "https://example.com/2.jpg"],
	"price": 9.9,
	"content": "<p>商品详情...</p>",
	"totalShares": 1000,
	"startTime": "2024-01-01T00:00:00Z",
	"endTime": "2024-01-31T23:59:59Z"
}
```

**响应示例：**

```json
{
	"code": 1,
	"message": "success",
	"data": {
		"id": 1,
		"typeId": 1,
		"title": "iPhone 15 Pro 抽奖",
		"subTitle": "最新款 iPhone 等你来抽",
		"mainPic": "https://example.com/image.jpg",
		"pics": ["https://example.com/1.jpg"],
		"price": "9.90",
		"sold": 0,
		"content": "<p>商品详情...</p>",
		"status": 1,
		"sortNum": 0,
		"totalShares": 1000,
		"soldCount": 0,
		"startTime": "2024-01-01T00:00:00.000Z",
		"endTime": "2024-01-31T23:59:59.000Z",
		"lotteryStatus": 1,
		"winnerId": null,
		"winningTicketNo": null,
		"drawnAt": null,
		"createTime": "2024-01-01T00:00:00.000Z",
		"updateTime": "2024-01-01T00:00:00.000Z"
	}
}
```

---

### 2. 更新商品

**接口地址：** `POST /admin/goods/info/update`

**是否需要登录：** 是

**请求参数：**

| 参数名    | 类型     | 必填 | 说明                                   |
| --------- | -------- | ---- | -------------------------------------- |
| id        | number   | 是   | 商品ID                                 |
| title     | string   | 否   | 商品标题                               |
| subTitle  | string   | 否   | 商品副标题                             |
| mainPic   | string   | 否   | 主图URL                                |
| pics      | string[] | 否   | 图片URL数组                            |
| content   | string   | 否   | 商品详情（HTML）                       |
| startTime | string   | 否   | 开始时间（ISO 8601）                   |
| endTime   | string   | 否   | 结束时间（ISO 8601）                   |
| status    | number   | 否   | 抽奖状态（1-进行中 2-已开奖 3-已取消） |

**请求示例：**

```json
{
	"id": 1,
	"title": "iPhone 15 Pro 抽奖（更新）",
	"status": 2
}
```

**响应示例：**

```json
{
  "code": 1,
  "message": "success",
  "data": {
    "id": 1,
    "title": "iPhone 15 Pro 抽奖（更新）",
    ...
  }
}
```

---

### 3. 删除商品

**接口地址：** `POST /admin/goods/info/delete`

**是否需要登录：** 是

**请求参数：**

| 参数名 | 类型     | 必填 | 说明       |
| ------ | -------- | ---- | ---------- |
| ids    | number[] | 是   | 商品ID数组 |

**请求示例：**

```json
{
	"ids": [1, 2, 3]
}
```

**响应示例：**

```json
{
	"code": 1,
	"message": "success"
}
```

**注意：** 已有购买的商品无法删除。

---

### 4. 获取商品详情

**接口地址：** `GET /admin/goods/info/info`

**是否需要登录：** 是

**请求参数：**

| 参数名 | 类型   | 必填 | 说明   |
| ------ | ------ | ---- | ------ |
| id     | number | 是   | 商品ID |

**响应示例：**

```json
{
  "code": 1,
  "message": "success",
  "data": {
    "id": 1,
    "title": "iPhone 15 Pro 抽奖",
    "totalShares": 1000,
    "soldCount": 500,
    "lotteryStatus": 1,
    "startTime": "2024-01-01T00:00:00.000Z",
    "endTime": "2024-01-31T23:59:59.000Z",
    ...
  }
}
```

---

### 5. 获取商品列表

**接口地址：** `GET /admin/goods/info/page`

**是否需要登录：** 是

**请求参数：**

| 参数名   | 类型   | 必填 | 说明                                   |
| -------- | ------ | ---- | -------------------------------------- |
| status   | number | 否   | 抽奖状态（1-进行中 2-已开奖 3-已取消） |
| page     | number | 否   | 页码，默认 1                           |
| pageSize | number | 否   | 每页数量，默认 10                      |

**响应示例：**

```json
{
  "code": 1,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "iPhone 15 Pro 抽奖",
        "totalShares": 1000,
        "soldCount": 500,
        "lotteryStatus": 1,
        "typeName": "数码产品",
        ...
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

---

### 6. 手动开奖

**接口地址：** `POST /admin/goods/info/draw`

**是否需要登录：** 是

**请求参数：**

| 参数名 | 类型   | 必填 | 说明   |
| ------ | ------ | ---- | ------ |
| id     | number | 是   | 商品ID |

**请求示例：**

```json
{
	"id": 1
}
```

**响应示例：**

```json
{
	"code": 1,
	"message": "success",
	"data": {
		"goodsId": 1,
		"winningTicketNo": "000123",
		"winnerId": 1001,
		"drawnAt": "2024-01-31T12:00:00.000Z"
	}
}
```

---

## 前端接口

### 1. 获取商品列表（免登录）

**接口地址：** `GET /app/goods/info/page`

**是否需要登录：** 否

**请求参数：**

| 参数名   | 类型   | 必填 | 说明                                   |
| -------- | ------ | ---- | -------------------------------------- |
| status   | number | 否   | 抽奖状态（1-进行中 2-已开奖 3-已取消） |
| page     | number | 否   | 页码，默认 1                           |
| pageSize | number | 否   | 每页数量，默认 10                      |

**响应示例：**

```json
{
	"code": 1,
	"message": "success",
	"data": {
		"list": [
			{
				"id": 1,
				"title": "iPhone 15 Pro 抽奖",
				"mainPic": "https://example.com/image.jpg",
				"price": "9.90",
				"totalShares": 1000,
				"soldCount": 500,
				"lotteryStatus": 1,
				"startTime": "2024-01-01T00:00:00.000Z",
				"endTime": "2024-01-31T23:59:59.000Z",
				"typeName": "数码产品"
			}
		],
		"total": 100,
		"page": 1,
		"pageSize": 10,
		"totalPages": 10
	}
}
```

---

### 2. 获取商品详情（免登录）

**接口地址：** `GET /app/goods/info/info`

**是否需要登录：** 否

**请求参数：**

| 参数名 | 类型   | 必填 | 说明   |
| ------ | ------ | ---- | ------ |
| id     | number | 是   | 商品ID |

**响应示例：**

```json
{
	"code": 1,
	"message": "success",
	"data": {
		"id": 1,
		"title": "iPhone 15 Pro 抽奖",
		"subTitle": "最新款 iPhone 等你来抽",
		"mainPic": "https://example.com/image.jpg",
		"pics": ["https://example.com/1.jpg"],
		"price": "9.90",
		"content": "<p>商品详情...</p>",
		"totalShares": 1000,
		"soldCount": 500,
		"startTime": "2024-01-01T00:00:00.000Z",
		"endTime": "2024-01-31T23:59:59.000Z",
		"lotteryStatus": 1
	}
}
```

---

### 3. 获取往期中奖记录（免登录）

**接口地址：** `GET /app/goods/info/history`

**是否需要登录：** 否

**请求参数：**

| 参数名   | 类型   | 必填 | 说明              |
| -------- | ------ | ---- | ----------------- |
| page     | number | 否   | 页码，默认 1      |
| pageSize | number | 否   | 每页数量，默认 10 |

**响应示例：**

```json
{
	"code": 1,
	"message": "success",
	"data": {
		"list": [
			{
				"id": 1,
				"title": "iPhone 15 Pro 抽奖",
				"mainPic": "https://example.com/image.jpg",
				"winningTicketNo": "000123",
				"winnerId": 1001,
				"drawnAt": "2024-01-31T12:00:00.000Z",
				"endTime": "2024-01-31T23:59:59.000Z"
			}
		],
		"total": 50,
		"page": 1,
		"pageSize": 10,
		"totalPages": 5
	}
}
```

---

### 4. 获取我的奖券

**接口地址：** `GET /app/goods/info/myTickets`

**是否需要登录：** 是

**请求参数：**

| 参数名   | 类型   | 必填 | 说明               |
| -------- | ------ | ---- | ------------------ |
| page     | number | 否   | 页码，默认 1       |
| pageSize | number | 否   | 每页数量，默认 10  |
| goodsId  | number | 否   | 筛选指定商品的奖券 |

**响应示例：**

```json
{
	"code": 1,
	"message": "success",
	"data": {
		"list": [
			{
				"id": 1,
				"lotteryId": 1,
				"ticketNo": "000123",
				"userId": 1001,
				"orderId": 1001,
				"status": 1,
				"createTime": "2024-01-15T10:00:00.000Z",
				"updateTime": "2024-01-15T10:00:00.000Z",
				"lottery": {
					"id": 1,
					"title": "iPhone 15 Pro 抽奖",
					"mainPic": "https://example.com/image.jpg"
				}
			}
		],
		"total": 5,
		"page": 1,
		"pageSize": 10,
		"totalPages": 1
	}
}
```

---

### 5. 获取可用的奖券号码（免登录）

**接口地址：** `GET /app/goods/info/availableTickets`

**是否需要登录：** 否

**请求参数：**

| 参数名  | 类型   | 必填 | 说明              |
| ------- | ------ | ---- | ----------------- |
| goodsId | number | 是   | 商品ID            |
| count   | number | 否   | 获取数量，默认 10 |

**响应示例：**

```json
{
	"code": 1,
	"message": "success",
	"data": ["000001", "000002", "000003", "000004", "000005"]
}
```

---

## 数据模型

### 商品信息 (GoodsInfo)

```typescript
{
  id: number;                    // 商品ID
  typeId: number;                // 商品类型ID
  title: string;                 // 商品标题
  subTitle: string;              // 商品副标题
  mainPic: string;               // 主图URL
  pics: string[];                // 图片URL数组
  price: string;                 // 价格（decimal）
  sold: number;                  // 已售数量
  content: string;               // 商品详情（HTML）
  status: number;                // 状态（0-下架 1-上架）
  sortNum: number;               // 排序
  // 抽奖相关字段
  totalShares: number;           // 总份数
  soldCount: number;             // 已售份数
  startTime: string;             // 开始时间
  endTime: string;               // 结束时间
  lotteryStatus: number;         // 抽奖状态（1-进行中 2-已开奖 3-已取消）
  winnerId: number;              // 中奖用户ID
  winningTicketNo: string;       // 中奖号码
  drawnAt: string;               // 开奖时间
  createTime: string;            // 创建时间
  updateTime: string;            // 更新时间
  typeName: string;              // 类型名称（关联查询）
}
```

### 奖券信息 (LotteryTicket)

```typescript
{
	id: number; // 奖券ID
	lotteryId: number; // 商品ID
	ticketNo: string; // 奖券号码
	userId: number; // 用户ID
	orderId: number; // 订单ID
	status: number; // 状态（0-未售出 1-已售出 2-中奖）
	createTime: string; // 创建时间
	updateTime: string; // 更新时间
	lottery: GoodsInfo; // 关联的商品
}
```

---

## 错误码

### 通用错误 (1xxx)

| 错误码 | 说明       |
| ------ | ---------- |
| 1001   | 参数错误   |
| 1002   | 服务器错误 |
| 1003   | 资源不存在 |

### 商品错误 (4xxx)

| 错误码 | 说明                   |
| ------ | ---------------------- |
| 4001   | 商品不存在             |
| 4002   | 商品活动已结束         |
| 4003   | 商品已售罄             |
| 4004   | 奖券不可用             |
| 4005   | 余额不足               |
| 4006   | 商品已有购买，无法删除 |
| 4007   | 已取消的商品不允许恢复 |

---

## 状态枚举

### 抽奖状态 (LotteryStatus)

| 值  | 说明   |
| --- | ------ |
| 1   | 进行中 |
| 2   | 已开奖 |
| 3   | 已取消 |

### 奖券状态 (TicketStatus)

| 值  | 说明   |
| --- | ------ |
| 0   | 未售出 |
| 1   | 已售出 |
| 2   | 中奖   |

### 商品上下架状态

| 值  | 说明 |
| --- | ---- |
| 0   | 下架 |
| 1   | 上架 |

---

## 注意事项

1. **时间格式**：所有时间字段使用 ISO 8601 格式（如：`2024-01-01T00:00:00Z`）

2. **价格格式**：价格字段返回字符串类型，精确到分（如：`"9.90"`）

3. **分页索引**：分页从 1 开始

4. **商品规则**：

    - 结束时间必须晚于开始时间
    - 已开奖的商品不允许修改
    - 已取消的商品不允许恢复为进行中
    - 有已售出奖券的商品不允许删除

5. **奖券分配**：奖券按顺序分配，先购先得

---

## 更新日志

### v3.0.0 (2025-01-12)

- 将 `lotteryData` JSON 字段拆分为独立字段
- 移除规格（spec）相关功能
- 商品统一为抽奖商品类型
- 重构服务层，整合 `GoodsLotteryService` 到 `GoodsInfoService`
- 更新接口路径，统一使用 `info` 作为控制器名称
