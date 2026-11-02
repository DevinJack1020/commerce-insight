# 事实卡：Commerce Insight / Market Loom（一页速览）

> 用于简历/README/面试前自检。所有数字来自仓库实测（2026-11-02，本机 Windows 沙箱），不是线上数据。详细边界见 [EXPERIMENT_DESIGN.md](EXPERIMENT_DESIGN.md)。

## 技术栈

| 层 | 事实 |
| --- | --- |
| 框架 | Next.js **16.4.2**（App Router，`app/layout.tsx` + `app/page.tsx`；构建用 Turbopack） |
| UI | React **19.3.1**、手写 CSS `app/globals.css`（77 行，含 900px / 600px 媒体查询）、lucide-react 0.546.0 图标 |
| 语言 | TypeScript **5.9.3**，`strict: true`，路径别名 `@/*` |
| 测试 | Node 内置 `node:test`，通过 `tsx` 4.23.0 运行；`pnpm test` = `tsx --test tests/**/*.test.ts` |
| 包管理 | pnpm **10.32.1**（`packageManager` 字段）；CI 使用 Node 22 |
| CI | `.github/workflows/ci.yml`：`pnpm install --frozen-lockfile` → `pnpm test` → `pnpm typecheck` → `pnpm build` |
| 规模 | 10 个 TS/TSX 文件共 **407 行（含空行）**（app 2 + components 3 + lib 4 + tests 1，另 globals.css 77 行），依赖极少（next/react/react-dom/lucide-react） |

## 已实现（可演示、有代码/测试依据）

- **发现与筛选**：中文搜索（匹配商品名 / 描述 / 标签）、3 个分类（居家 / 数码 / 穿搭）、3 个市场（SG / MY / PH）；6 件演示商品；筛选结果计数与空状态。
- **详情弹层**：商品图块、评分与评价数、价格、含税/退换/配送静态承诺文案、加入购物车。
- **购物车与免运费**：整数分计算（`lib/commerce.ts`）；商品小计；**SGD 199（19,900 分）免运费，否则 SGD 9（900 分）**；空购物车不能下单。
- **模拟订单**：前端清空购物车并生成订单号 `ML-<年份>-<2840+件数>`；明确提示「演示模式：不会收集地址或触发真实支付」；刷新后状态丢失（无持久化）。
- **价格显示**：`Intl.NumberFormat("zh-CN", …)` 以 SGD 显示；`calculateLandedPrice`（含税到手价）已实现并有单测。
- **确定性 A/B 分组**：`assignExperiment` 稳定哈希（`h=(h*31+charCode)>>>0; h%2`），同一 ID 恒定同组；10,000 个测试 ID 抽样 control 占 50.0%。
- **事件模型**：5 个事件名类型定义（`product_list_viewed` / `product_viewed` / `product_added` / `checkout_started` / `order_completed`）；`captureEvent` 派发浏览器 `CustomEvent("commerce-insight:event")`，可在本页监听。
- **演示漏斗看板**：4 步漏斗 + 指标卡，区块标 `PRODUCT SIGNALS / DEMO DATA` 与「演示数据」角标；`buildFunnel` 从计数算阶段转化。
- **文档**：PRD、指标口径、用户研究**模板**、实验设计、事实卡、上游归属（Medusa / PostHog 边界声明）。
- **响应式**：桌面/移动截图（`docs/screenshots/`，1440px 与 390px 视口），移动端隐藏主导航、单列商品卡。
- **工程化**：strict 类型检查通过；3 个 suite / 4 个用例单测通过；类型化领域逻辑与 UI 分层。

## 未实现 / 仅预留（面试必须说清）

| 能力 | 真实状态 |
| --- | --- |
| A/B **排序策略**分叉 | ❌ 未实现。`visible` 始终是 `filterProducts(products,…)`，A/B 组渲染相同顺序，仅显示不同分组标签 |
| 真实实验分流 | ❌ 演示页把 `visitorId` 硬编码为 `"portfolio-visitor"`（实测落入 B 组），所有访客看到同一组；无曝光日志、无分组归属、无指标聚合、无统计检验 |
| PostHog 接入 | ❌ 未安装 PostHog SDK，无网络上报；仅事件命名兼容 + CustomEvent 桥接；`.env.example` 有 `NEXT_PUBLIC_POSTHOG_*` 占位 |
| Medusa 兼容后端 | ⚠️ 仅 1 个方法 `CommerceBackend.listProducts()` + `DemoCommerceBackend` 读本地数组；无 Medusa SDK、无 HTTP 调用、无购物车/库存/订单/区域价格接口 |
| `product_list_viewed` 事件 | ❌ 只有类型定义，UI 未触发；实际只触发 4 类事件 |
| 事件属性 | ⚠️ 实际只发 `product_id` / `price` / `total` / `order_id`；METRICS 计划的 `variant` / `market` / `category` / `result_count` / `quantity` / `item_count` 均未发送 |
| 关税/税费/多币种 | ❌ 未实现；`calculateLandedPrice` 有函数与单测但未接入 UI；详情页「本地化含税价格」是静态文案；市场筛选只过滤商品，不切币种/税率 |
| 服务端能力 | ❌ 无服务端购物车、库存校验、支付、订单持久化、账户/认证、数据库 |
| 真实用户研究 | ❌ 只有执行模板（`docs/USER_RESEARCH_TEMPLATE.md`），未访谈真实用户 |
| Playwright E2E | ❌ `@playwright/test` 是 devDependency，但无测试文件、无 e2e 脚本 |
| V1.1 / V1.2 / V2 | ❌ PRD 中的版本规划，均未实现 |

## 演示数据清单（站内所有数字来源）

- 6 件商品及价格/评分/评价数/标签：`lib/catalog.ts`（虚构）。
- 漏斗计数 **1,280 → 794 → 401 → 246**：`components/insight-panel.tsx` 常量，硬编码。
- 阶段转化 **100% / 62% / 51% / 61%**：`buildFunnel` 整数取整；指标卡 **62.0% / 50.5% / 61.3%**、「目标 +4.0pp」「近 7 日 +2.6%」「守护指标 ≥ 58%」为静态演示文案（50.5% 与漏斗 51% 系取整差异）。
- 分组标签：由固定 `visitorId` 计算，非真实样本。
- 订单号：前端模拟生成；页面底部与弹层均标注演示。
- 仓库中**没有**真实用户、真实订单、真实营收、真实实验显著结果。

## 测试与构建状态（本轮实测）

| 检查 | 结果 | 说明 |
| --- | --- | --- |
| `git status --short` | ✅ 干净 | `next-env.d.ts` 已恢复为已提交版本（`./.next/types/*`），无遗留改动 |
| 类型检查 `tsc --noEmit` | ✅ 通过（exit 0，0 错误） | 直接运行 `node node_modules/typescript/bin/tsc --noEmit --incremental false` |
| 单元测试 4/4 | ✅ 通过 | `pnpm test` 被沙箱阻塞（pnpm store `EPERM`）；测试子进程也被阻塞（`spawn EPERM`）。兜底方式：esbuild 打包测试到系统临时目录后 `node` 直接运行 → 4 pass / 0 fail |
| 生产构建 `pnpm build` | ❌ 本环境未验证 | 被沙箱拒绝：`EPERM … .next\trace`、Turbopack lockfile「拒绝访问」。仓库内 `.next/` 为早先非沙箱环境产物（gitignored），本轮未作为通过证据 |
| CI 配置 | ✅ 存在 | GitHub Actions 按 test → typecheck → build 顺序执行；本机未运行 CI |

## 可以怎么说 / 不能怎么说（面试口径）

**可以说**：

- 「用 Next.js App Router + TypeScript 实现了一个离线可运行的跨境电商转化漏斗演示，包含发现/详情/加购/免运费/模拟订单完整路径，价格全程整数分计算。」
- 「实现了确定性的 50/50 稳定哈希分流逻辑和事件类型定义，并把指标口径、实验设计、样本量测算、决策规则写成了文档。」
- 「用 Medusa Store API 和 PostHog 的领域边界预留了适配接口与事件命名，真实接入是下一步。」
- 「测试和类型检查通过；构建在 CI 中执行。」

**不能说**：

- ❌「跑过真实 A/B 实验」「线上实验显著提升 X%」「有真实用户/营收数据」。
- ❌「接入了 Medusa / PostHog」——只能说预留了兼容边界。
- ❌「实现了到手价/税费计算」——函数存在但未接入 UI。
- ❌「有 E2E 测试覆盖」——只有 4 个单元测试。

## 迁移到真实业务的最小改造路径

1. **数据**：`DemoCommerceBackend` → 真实 `CommerceBackend` 实现（Medusa Store API / 自建 API），保持 `Product` 映射层不变。
2. **分流**：`visitorId` 改为持久化 cookie/账号 ID；哈希换成带盐 HMAC；分组写入事件属性并持久化曝光。
3. **实验**：真正实现两套排序函数，B 组按可解释价值分排序；主指标/诊断/护栏按 [EXPERIMENT_DESIGN.md](EXPERIMENT_DESIGN.md) 前置锁定。
4. **采集**：`captureEvent` 改为「先写自有事件存储，再按配置异步转发 PostHog」；补齐事件属性与去重键。
5. **交易**：服务端购物车、库存/价格校验、税费与免运费规则、支付回调、订单持久化；前端只做展示与幂等提交。
6. **验证**：Playwright 覆盖发现→详情→加购→结算→订单；实验指标聚合与统计检验脚本；护栏监控。
