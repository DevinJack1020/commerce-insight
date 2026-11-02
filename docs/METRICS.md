# 埋点与指标口径

> **状态说明（2026-11-02）**：下表前三列是**目标口径**（真实接入 PostHog 时应对齐），最后一列是当前仓库的实际实现。本仓库没有真实采集与上报，界面数值均为演示数据。实现细节与实验方案见 [EXPERIMENT_DESIGN.md](EXPERIMENT_DESIGN.md)。

## 事件字典

| 事件 | 目标触发时机 | 目标必备属性 | 当前实现（已核对代码） |
| --- | --- | --- | --- |
| `product_list_viewed` | 商品列表展示且筛选稳定 | market, category, result_count, variant | ⚠️ **仅类型定义，UI 未触发**；无属性 |
| `product_viewed` | 打开商品详情 | product_id, market, variant | ✅ 打开详情弹层时触发；实际只带 `product_id` |
| `product_added` | 商品成功加入购物车 | product_id, price, quantity | ✅ 加购时触发；实际带 `product_id`、`price`，无 `quantity` |
| `checkout_started` | 点击结算且购物车非空 | total, item_count | ✅ 点击「模拟结算并下单」且购物车非空时触发；实际只带 `total` |
| `order_completed` | 服务端确认订单 | order_id, total, item_count | ⚠️ 前端模拟下单成功即触发（**非服务端确认**）；实际带 `order_id`、`total` |

实现方式：`lib/analytics.ts` 的 `captureEvent(name, properties)` 仅在浏览器中派发 `CustomEvent("commerce-insight:event")`，不做网络上报；监听示例：

```ts
window.addEventListener("commerce-insight:event", (event) => {
  const { name, properties } = (event as CustomEvent).detail;
  console.info(name, properties);
});
```

## 漏斗与指标口径

核心漏斗：列表访问用户 → 查看详情用户 → 加购用户 → 完成订单用户。每一步按**去重用户数**计算；详情点击率以列表访问用户为分母，加购率以详情用户为分母，下单完成率以开始结算用户为分母。

- 主指标：订单转化率（列表访问 → 完成订单）。
- 诊断指标：详情点击率、详情到加购率、结算完成率。
- 守护指标：退款率、页面错误率、P75 LCP、每单客服咨询率。

当前实现差距：

- 演示漏斗只有 4 步（`components/insight-panel.tsx` 常量计数 1,280 / 794 / 401 / 246），**没有「结算」计数**，因此「结算完成率」不可计算；界面「下单完成率 61.3%」实为加购→订单（246 / 401）。
- 无去重、无用户标识上报、无 `variant` 属性，因此**无法按实验组聚合**。
- 守护指标均未采集，仅存在于本文与实验设计中。

## 实验口径

A/B 实验假设：按「到手价值」排序比默认编辑排序提高详情到加购率；业务主指标为订单转化率。分流单位为匿名访客，目标 50/50；同一访客稳定同组。

当前实现：`assignExperiment` 的稳定哈希逻辑已实现且有单测；但演示页使用硬编码 visitorId（固定进入一组），两种排序策略未实现，也无曝光与分组指标。真实基线、MDE、样本量与决策规则见 [EXPERIMENT_DESIGN.md](EXPERIMENT_DESIGN.md)；界面中的「目标 +4.0pp」「近 7 日 +2.6%」「守护指标 ≥ 58%」均为演示标注，不是真实结果。
