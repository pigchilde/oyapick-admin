## 项目概述

OyaPick 管理后台，基于 `cool-admin-vue 8.x` 二次开发。技术栈：Vue 3.5 + TypeScript 5.5 + Vite 5 + Element Plus 2 + Pinia + @cool-vue/crud。

- 应用名：OyaPick（见 `.env`）
- 开发端口：`9000`，基础路径：`/manage/`
- 默认代理：`/dev -> http://127.0.0.1:7077`

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm build-static # 静态路由构建
pnpm build-demo   # 演示模式构建
pnpm lint         # ESLint 检查并自动修复
pnpm format       # Prettier 格式化 src/
pnpm type-check   # vue-tsc 类型检查
```

## 目录结构与路径别名

| 路径别名 | 实际路径 | 用途 |
|---------|---------|------|
| `/@/` | `src/` | 框架核心（cool、config、plugins） |
| `/$/` | `src/modules/` | 业务模块 |
| `/#/` | `src/plugins/` | 插件功能（crud、upload、i18n、theme 等） |
| `/~/` | `packages/` | 本地包（crud、vite-plugin） |

## 业务模块（src/modules）

- `base`：登录、权限、菜单、用户中心、系统基础页（含 store、components、directives、locales）
- `goods`：商品管理（抽奖商品、开奖、提货码核验、抽奖状态）
- `order`：订单与退款管理（含 dict 子目录）
- `distribution`：分销管理（分销商、佣金、提现审核、配置、资金统计）
- `user`：用户管理（含 locales）
- `market`：营销能力
- `cs`：客服消息（含 hooks、websocket）
- `info`：规则、Banner 等内容配置
- `dict`：字典管理（含 store）
- `space`：文件空间管理
- `task`：任务管理
- `recycle`：回收站
- `robot`：机器人任务
- `app`：App 反馈、版本管理
- `helper` / `demo`：辅助与演示

## 模块结构规范

模块目录下通常包含：

```
src/modules/<domain>/
├── config.ts       # 路由与模块配置（ModuleConfig）
├── index.ts        # 模块入口（可选）
├── views/          # 页面组件
├── components/     # 模块私有组件
├── store/          # Pinia 状态管理
├── hooks/          # 组合式函数
├── locales/        # i18n 翻译文件
├── dict/           # 字典数据
├── types/          # 类型定义
└── static/         # 静态资源
```

不是每个模块都有全部子目录，按需创建即可。

## 核心开发模式

### 页面开发

页面基于 `@cool-vue/crud` 的 `cl-crud` 体系，典型结构：

```vue
<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-filter label="状态">
        <cl-select :options="options.status" prop="status" />
      </cl-filter>
      <cl-flex1 />
      <cl-search-key placeholder="搜索关键词" />
    </cl-row>
    <cl-row>
      <cl-table ref="Table" />
    </cl-row>
    <cl-row>
      <cl-flex1 />
      <cl-pagination />
    </cl-row>
    <cl-upsert ref="Upsert" />
  </cl-crud>
</template>

<script setup lang="ts">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();
const Crud = useCrud({});
const Table = useTable({});
const Upsert = useUpsert({});
</script>
```

### 路由注册

在模块的 `config.ts` 中通过 `views` 数组注册路由：

```ts
import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => ({
  views: [
    {
      path: '/distribution/withdrawal',
      meta: { label: '提现审核' },
      component: () => import('./views/withdrawal.vue')
    }
  ]
});
```

### API 调用

通过 `useCool()` 获取 `service`，按 EPS 自动生成的接口路径调用后端：

```ts
const { service } = useCool();
// 对应后端 /admin/distribution/withdrawal/list
await service.distribution.withdrawal.page({ page: 1, size: 20 });
```

### 状态管理

使用 Pinia store，放在模块的 `store/` 目录下，通过 `useStore()` 导出。

## 编码规范

- 使用 tabs 缩进（与现有代码一致）
- Vue 组件名使用 kebab-case（ESLint 强制）
- `@typescript-eslint/no-explicit-any` 已关闭，允许 `any` 类型
- `vue/no-mutating-props` 已关闭，但仍应避免直接修改 props
- 提交前运行 `pnpm lint && pnpm format`
- commit 格式：`<emoji> <type>(scope): <中文描述>`，参考 `git log`

## AI 编码行为规范

> 以下规范偏向谨慎而非速度，对于简单的任务可以根据实际情况灵活处理。

### 1. 先思考再编码

**不要假设，不要隐藏困惑，主动暴露权衡取舍。**

动手之前：
- 明确说出你的假设，如果不确定就直接提问
- 如果存在多种理解方式，全部列出来，不要自己默默选一个
- 如果有更简单的方案，直接说出来
- 如果哪里不清楚，停下来，指出困惑点，提出问题

### 2. 简单至上

**用最少的代码解决问题，不写投机性代码。**

- 只做需求范围内的事，不额外加功能
- 不为只用一次的代码建抽象层
- 不做没被要求的"灵活性"或"可配置性"
- 不为不可能发生的场景加错误处理
- 如果写了 200 行代码但 50 行就能搞定，重写

随时自问：换一个高级工程师来看，会觉得这段代码过度设计吗？如果是，简化它。

### 3. 精准修改

**只碰必须改的，只清理自己造成的混乱。**

编辑已有代码时：
- 不要"顺手优化"相邻的代码、注释或格式
- 不要重构没有坏的东西
- 匹配现有风格，即使你更习惯另一种写法
- 如果发现无关的死代码，提出来就好，不要直接删

当你的改动产生了孤立代码时：
- 删除你的改动导致不再使用的 import / 变量 / 函数
- 不要删除改动前就存在的死代码，除非被明确要求

检验标准：diff 中的每一行改动都应该能追溯到具体的需求。

### 4. 目标驱动执行

**定义成功标准，循环验证直到通过。**

将任务转化为可验证的目标：
- "加校验" → "为非法输入写测试用例，然后让它们通过"
- "修 bug" → "写一个能复现 bug 的测试，然后修掉它"
- "重构 X" → "确保重构前后测试都通过"

多步骤任务先列出简要计划：
```
1. [步骤] → 验证: [检查项]
2. [步骤] → 验证: [检查项]
3. [步骤] → 验证: [检查项]
```

清晰的成功标准让你能独立推进，模糊的标准则会导致不断需要确认。

---

**这些规范是否生效，看这几个信号：** diff 中不必要的改动是否变少了、是否不再因为过度设计而返工、澄清性问题是否出现在动手之前而不是犯完错之后。
