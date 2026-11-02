# Commerce Insight / Market Loom

面向东南亚跨境电商的商品发现与转化漏斗作品集：Next.js App Router 单页演示，**离线运行**，不需要数据库、密钥或支付信息，走通「发现 → 详情 → 加购 → 结算 → 模拟订单」闭环，并把漏斗口径、A/B 分流逻辑与实验设计放进同一套产品叙事。

> **演示声明**：站内商品、评价、订单、漏斗计数、指标卡与实验分组标签均为本地演示数据；本仓库没有接入真实支付、真实分析平台或真实 Medusa 服务，也没有执行真实用户研究或线上 A/B 实验。事件命名与后端接口按 PostHog / Medusa 的领域边界**预留**，各自做到哪一步见下表、[事实卡](docs/FACT_CARD.md) 与 [上游归属](UPSTREAM.md)。

![Market Loom 商品发现页](docs/screenshots/commerce-insight-desktop.png)

## 已实现（2026-11-02 对照代码逐条核对）

### 发现与转化主路径

- 中文搜索（匹配商品名 / 描述 / 标签）、3 个分类（居家 / 数码 / 穿搭）、3 个市场（SG / MY / PH）筛选；6 件演示商品。
- 商品卡、详情弹层（价格、评分、购买理由、含税/退换/配送文案）、加入购物车、购物车抽屉。
- 购物车以**整数分**计算；**SGD 199（19,900 分）免运费，否则 SGD 9（900 分）**；空购物车不能下单。
- 模拟结算：点击「模拟结算并下单」生成订单号 `ML-<年份>-<2840+件数>` 并清空购物车；明确提示不收集地址、不触发真实支付；**无持久化**，刷新即丢失。

### 数据、实验与后端边界

| 能力 | 做到哪一步 |
| --- | --- |
| 事件模型 | 5 个事件名有类型定义（`product_list_viewed` / `product_viewed` / `product_added` / `checkout_started` / `order_completed`）；UI **实际触发 4 个**，`product_list_viewed` 只有定义未触发 |
| 采集实现 | `captureEvent` 只派发浏览器 `CustomEvent("commerce-insight:event")`，可在本页监听；**未安装 PostHog SDK、无任何网络上报**；`.env.example` 仅预留变量名 |
| A/B 分组 | `assignExperiment` 稳定哈希（`h=(h*31+charCode)>>>0; h%2`），同一访客恒定同组；对 10,000 个测试 ID 抽样 control 占 50.0% |
| A/B 演示局限 | 演示页 `visitorId` 硬编码为 `"portfolio-visitor"`，实测落入 B 组 —— 页面固定展示同一分组；**两种排序策略未实现**，A/B 组渲染相同的目录顺序，仅标签不同；无曝光、无分组指标、无统计检验 |
| 漏斗看板 | 硬编码计数 1,280 → 794 → 401 → 246，阶段转化 100% / 62% / 51% / 61%（整数取整）；区块标 `PRODUCT SIGNALS / DEMO DATA` 与「演示数据」角标；指标卡 62.0% / 50.5% / 61.3% 为静态演示文案（50.5% 与漏斗取整 51% 系展示取整差异） |
| 价格逻辑 | 整数分计算与 SGD 显示；含税到手价函数 `calculateLandedPrice` 已实现并有单测，但**未接入 UI**；未实现真实税费、多币种或按市场切换价格 |
| Medusa 兼容接口 | `CommerceBackend` 接口仅有 `listProducts()` 一个方法，`DemoCommerceBackend` 直接返回本地数组；无 Medusa SDK、无 HTTP 调用、无购物车/库存/订单接口 |

### 界面、测试与 CI

- 响应式界面：`app/globals.css` 含 900px / 600px 断点与 `prefers-reduced-motion`；桌面/移动截图见 [docs/screenshots](docs/screenshots)。
- 单元测试：Node 内置 `node:test` + `tsx`，3 个 suite / 4 个用例（搜索筛选、含税到手价与购物车、分组确定性、漏斗计算）——本轮 4/4 通过。
- 类型检查：TypeScript `strict` + `tsc --noEmit` —— 本轮通过（0 错误）。
- CI：[.github/workflows/ci.yml](.github/workflows/ci.yml) 在 Node 22 上执行 `pnpm install --frozen-lockfile` → `pnpm test` → `pnpm typecheck` → `pnpm build`。仓库**没有** Playwright 测试文件，`@playwright/test` 只是 devDependency。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Next.js 16.4.2（App Router，Turbopack 构建） |
| UI | React 19.3.1、手写 CSS（`app/globals.css`）、lucide-react 0.546.0 |
| 语言 | TypeScript 5.9.3（`strict`，路径别名 `@/*`） |
| 测试 | `node:test` + `tsx` 4.23.0 |
| 包管理 / CI | pnpm 10.32.1；GitHub Actions（Node 22） |

## 快速开始

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

演示模式不需要 `.env`；生产接入变量示例见 [.env.example](.env.example)。

```bash
pnpm test         # tsx --test tests/**/*.test.ts
pnpm typecheck    # tsc --noEmit
pnpm build        # next build
```

> Windows 本地若 shell 未展开 `tests/**/*.test.ts` 通配符，可直接运行 `pnpm exec tsx --test tests/commerce.test.ts`。

## 项目结构

```text
app/          # App Router 入口：layout.tsx、page.tsx、globals.css
components/   # Storefront、ProductCard、InsightPanel
lib/          # catalog（商品与筛选）、commerce（价格/购物车）、analytics（分组与事件）、medusa-adapter（后端边界）
tests/        # node:test 单元测试
docs/         # PRD、指标口径、实验设计、事实卡、用户研究模板、设计与计划文档
```

## 文档索引

- [事实卡 FACT_CARD](docs/FACT_CARD.md)：一页看清「已实现 / 未实现 / 演示数据 / 验证状态」
- [实验设计 EXPERIMENT_DESIGN](docs/EXPERIMENT_DESIGN.md)：H1/H2、主/诊断/护栏指标、分流实现、样本量测算、决策规则、上线前置条件
- [PRD](docs/PRD.md)
- [指标与埋点口径](docs/METRICS.md)
- [用户研究执行模板](docs/USER_RESEARCH_TEMPLATE.md)（**模板，未执行**）
- [设计说明](docs/superpowers/specs/2026-10-23-commerce-insight-design.md)（**设计草案**：含未实现的 Medusa 后端、AI 评论摘要、PostHog SDK 等设想）
- [实施计划](docs/superpowers/specs/2026-10-23-commerce-insight-implementation-plan.md)（**计划文档**，多数任务未落地）
- [上游归属与边界](UPSTREAM.md)

## 验证记录（2026-11-02，Windows 沙箱）

| 命令 | 结果 |
| --- | --- |
| `git status --short` | 干净（`next-env.d.ts` 已恢复为提交版本） |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false` | ✅ exit 0，无错误 |
| `pnpm test` | ⛔ 被沙箱阻塞：`EPERM: operation not permitted, mkdir '…\pnpm\store'`（pnpm 未启动） |
| `tsx --test tests/commerce.test.ts` | ⛔ 被沙箱阻塞：`node:test` 子进程 `spawn EPERM`（沙箱禁止命名管道） |
| 兜底：esbuild 打包测试到系统临时目录后 `node` 运行 | ✅ 4 pass / 0 fail |
| `pnpm build` / `next build` | ⛔ 被沙箱阻塞：`EPERM …\.next\trace`、Turbopack lockfile「拒绝访问」；**本环境未验证生产构建**（仓库内 `.next/` 为早先产物，未作为通过依据） |

结论：类型检查与单元测试在本轮通过；生产构建需在可写仓库目录的普通环境或 CI 中验证。

## 诚实边界

- 界面中的商品、订单、漏斗、评价和实验结果均为演示数据；用户研究文件是执行模板，不代表已经访谈真实用户。
- **没有**真实 A/B 实验、真实用户、真实营收或显著结果；不要把演示漏斗计数当成线上指标。
- **没有**接入 PostHog 或 Medusa 服务；只有事件命名兼容与一个可替换的后端接口。
- **未实现**服务端购物车、库存校验、支付回调、税费服务、账户/认证、数据持久化、Playwright E2E 与实验统计分析。
- 接入生产环境前还需要：真实分流与曝光、服务端交易链路、隐私同意与数据保留策略、指标聚合与护栏监控。清单见 [EXPERIMENT_DESIGN.md 第 8 节](docs/EXPERIMENT_DESIGN.md#8-上线前置条件checklist)。

---

## English

Commerce Insight (Market Loom) is an offline, Medusa-compatible and PostHog-ready **portfolio demo** for Southeast Asian product discovery. It ships a complete local demo journey (discovery → detail → cart → simulated checkout → simulated order), typed domain logic with integer-cent pricing, a deterministic 50/50 hash-based assignment function, a demo funnel panel, responsive UI, unit tests, strict type checking, and product documentation.

What is real: the discovery/UI flow, cart and free-shipping rules, deterministic assignment logic, funnel percentage helper, tests and typecheck. What is **not**: there is no live PostHog/Medusa integration, no server-side cart/inventory/payment, no per-market currency or tax calculation wired into the UI, no real A/B sorting strategy, no experiment data and no real user research. All checked-in figures are explicitly simulated; see [docs/FACT_CARD.md](docs/FACT_CARD.md) and [docs/EXPERIMENT_DESIGN.md](docs/EXPERIMENT_DESIGN.md).

Run `pnpm install && pnpm dev`. No credentials required for demo mode.
