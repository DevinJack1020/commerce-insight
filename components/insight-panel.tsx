import { Activity, FlaskConical, MousePointerClick, ShoppingBag } from "lucide-react";
import { buildFunnel, type ExperimentVariant } from "@/lib/analytics";

const STEPS = ["浏览列表", "查看详情", "加入购物车", "完成订单"];
const COUNTS = [1280, 794, 401, 246];

export function InsightPanel({ variant }: { variant: ExperimentVariant }) {
  const conversions = buildFunnel(COUNTS);
  return (
    <section className="insight-panel" id="insights">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PRODUCT SIGNALS / DEMO DATA</p>
          <h2>不只做页面，也解释增长机会</h2>
        </div>
        <span className="demo-pill">演示数据</span>
      </div>
      <div className="metric-grid">
        <article><MousePointerClick size={18} /><span>详情点击率</span><strong>62.0%</strong><small>目标 +4.0pp</small></article>
        <article><ShoppingBag size={18} /><span>详情到加购</span><strong>50.5%</strong><small>近 7 日 +2.6%</small></article>
        <article><Activity size={18} /><span>下单完成率</span><strong>61.3%</strong><small>守护指标 ≥ 58%</small></article>
        <article><FlaskConical size={18} /><span>实验分组</span><strong>{variant === "control" ? "A 对照组" : "B 价值排序"}</strong><small>稳定哈希分流</small></article>
      </div>
      <div className="funnel">
        {STEPS.map((step, index) => (
          <div className="funnel-step" key={step}>
            <div><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>
            <div className="funnel-bar"><i style={{ width: `${conversions[index]}%` }} /></div>
            <p><b>{COUNTS[index]?.toLocaleString()}</b><small>{conversions[index]}% 阶段转化</small></p>
          </div>
        ))}
      </div>
    </section>
  );
}
