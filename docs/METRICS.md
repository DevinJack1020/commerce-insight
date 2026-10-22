# 埋点与指标口径

| 事件 | 触发时机 | 必备属性 |
| --- | --- | --- |
| `product_list_viewed` | 商品列表展示且筛选稳定 | market, category, result_count, variant |
| `product_viewed` | 打开商品详情 | product_id, market, variant |
| `product_added` | 商品成功加入购物车 | product_id, price, quantity |
| `checkout_started` | 点击结算且购物车非空 | total, item_count |
| `order_completed` | 服务端确认订单 | order_id, total, item_count |

核心漏斗：列表访问用户 → 查看详情用户 → 加购用户 → 完成订单用户。每一步按去重用户数计算；详情点击率以列表访问用户为分母，加购率以详情用户为分母，下单完成率以开始结算用户为分母。

主指标：订单转化率。诊断指标：详情点击率、详情到加购率、结算完成率。守护指标：退款率、页面错误率、P75 LCP、每单客服咨询率。

A/B 实验假设：按“到手价值”排序比默认编辑排序提高详情到加购率。分流单位为匿名访客，目标 50/50；至少运行一个完整业务周期，显著性与最小样本量应在真实基线数据获得后计算，当前界面数值只是演示。
