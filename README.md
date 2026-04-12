# OyaPick Admin

OyaPick 管理后台项目，基于 `Vue 3 + TypeScript + Vite + Element Plus + cool-admin`。

当前仓库用于 OyaPick 抽奖电商系统的管理端运营能力，包括商品抽奖管理、订单、用户、客服、分销、内容与基础权限管理等模块。

## 项目状态

- 前端框架：`cool-admin-vue 8.x` 二次开发
- 应用名：`OyaPick`（见 `.env`）
- 开发端口：`9000`
- 构建基础路径：`/manage/`
- 默认开发代理：`/dev -> http://127.0.0.1:7077`

## 关联仓库

- 管理后台前端（本仓库）：`oyapick-admin`
- 后端服务：`../oyapick-server`
- C 端站点：`../oyapick-site`

## 技术栈

- Vue 3.5
- TypeScript 5.5
- Vite 5
- Element Plus 2
- Pinia
- Vue Router 4
- Vue I18n
- @cool-vue/crud
- ECharts / WangEditor / xlsx

## 功能模块（src/modules）

- `base`：登录、权限、菜单、用户中心、系统基础页
- `goods`：商品管理（抽奖商品、开奖、提货码核验、抽奖状态管理）
- `order`：订单与退款管理
- `market`：营销能力（如优惠券）
- `user`：用户管理
- `distribution`：分销管理（分销商、佣金、提现、配置、统计）
- `app`：App 反馈、版本、商品投诉等
- `space`：文件空间
- `dict`：字典管理
- `task`：任务管理
- `recycle`：回收站
- `cs`：客服消息能力
- `robot`：机器人任务
- `info`：规则、Banner 等内容配置
- `helper` / `demo`：辅助与演示模块

> 具体页面权限与菜单展示由后端返回菜单/权限控制。

## 快速开始

### 1) 环境要求

- Node.js：建议 `>= 18`
- 包管理器：推荐 `pnpm`

### 2) 安装依赖

```bash
pnpm install
```

### 3) 启动开发环境

```bash
pnpm dev
```

默认访问（受 `base=/manage/` 影响）：

- `http://localhost:9000/manage/`

## 环境与代理配置

### `.env`

```env
VITE_NAME=OyaPick
```

### 代理（`src/config/proxy.ts`）

- `/dev/` -> `http://127.0.0.1:7077`
- `/prod/` -> `https://show.cool-admin.com`

默认 `current=dev`，即开发时请求前缀为 `/dev`。

如需切换代理环境，可在启动前设置环境变量 `VITE_PROXY_ENV`。

示例：

```bash
VITE_PROXY_ENV=prod pnpm dev
```

## 可用脚本

```bash
# 本地开发
pnpm dev

# 生产构建
pnpm build

# 静态构建（hash 路由）
pnpm build-static

# 演示模式构建
pnpm build-demo

# 本地预览构建产物
pnpm preview

# 类型检查
pnpm type-check

# ESLint 自动修复
pnpm lint

# 格式化 src/
pnpm format
```

## 目录结构

```text
oyapick-admin/
├── src/
│   ├── config/          # 环境、代理、全局配置
│   ├── cool/            # cool-admin 核心封装（bootstrap、service、router）
│   ├── modules/         # 业务模块
│   ├── plugins/         # 插件模块（crud、upload、theme、i18n 等）
│   └── main.ts          # 应用入口
├── public/              # 静态资源
├── build/               # 构建辅助文件
├── packages/            # 本地包（vite-plugin、crud）
├── vite.config.ts
└── README.md
```

## 部署说明

### 前端静态部署

1. 执行 `pnpm build`
2. 将 `dist/` 部署到静态服务器
3. 保证服务器将 `/manage/*` 路由回退到 `index.html`

### Nginx / Docker

仓库包含：

- `nginx.conf`
- `Dockerfile`

`Dockerfile` 会构建前端并将产物放入 Nginx 容器 `/app`，同时按 `nginx.conf` 转发 `/api/` 与 `/socket` 到后端服务。

## 说明

- 路由模式默认是 `history`；`build-static` 模式下为 `hash`。
- 国际化默认语言为 `zh-cn`，支持 `zh-cn / zh-tw / en`。
- 商品模块接口文档见：`src/modules/goods/API.md`。
