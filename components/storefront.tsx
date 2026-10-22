"use client";

import { ArrowRight, Check, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { assignExperiment, captureEvent } from "@/lib/analytics";
import { filterProducts, products, type Market, type Product } from "@/lib/catalog";
import { calculateCart, formatPrice } from "@/lib/commerce";
import { InsightPanel } from "./insight-panel";
import { ProductCard } from "./product-card";

type Cart = Record<string, number>;
const CATEGORIES = ["全部", "居家", "数码", "穿搭"];
const MARKETS: { id: Market | "ALL"; label: string }[] = [
  { id: "ALL", label: "全部市场" }, { id: "SG", label: "新加坡" },
  { id: "MY", label: "马来西亚" }, { id: "PH", label: "菲律宾" },
];

export function Storefront() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [market, setMarket] = useState<Market | "ALL">("ALL");
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const variant = assignExperiment("portfolio-visitor");
  const visible = useMemo(() => filterProducts(products, { category, market, query }), [category, market, query]);
  const lines = products.flatMap((product) => cart[product.id] ? [{ ...product, quantity: cart[product.id] }] : []);
  const totals = calculateCart(lines);
  const cartCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  function openProduct(product: Product) {
    setSelected(product);
    captureEvent("product_viewed", { product_id: product.id });
  }
  function addToCart(product: Product) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    setSelected(null);
    setCartOpen(true);
    captureEvent("product_added", { price: product.price, product_id: product.id });
  }
  function completeOrder() {
    if (cartCount === 0) return;
    captureEvent("checkout_started", { total: totals.total });
    const id = `ML-${new Date().getFullYear()}-${String(2840 + cartCount)}`;
    setOrderId(id);
    setCart({});
    captureEvent("order_completed", { order_id: id, total: totals.total });
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top"><span>ML</span> Market Loom</a>
        <nav aria-label="主导航"><a href="#discover">发现</a><a href="#insights">数据洞察</a><a href="#about">项目说明</a></nav>
        <button className="cart-button" onClick={() => setCartOpen(true)} type="button"><ShoppingCart size={17} />购物车 <b>{cartCount}</b></button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">CURATED FOR SOUTHEAST ASIA · 2026</p>
          <h1>让好商品，<br /><em>更容易被发现。</em></h1>
          <p>以编辑策展的温度，结合漏斗数据与实验方法，重做跨境电商从浏览到下单的关键路径。</p>
          <a className="primary-link" href="#discover">开始探索 <ArrowRight size={17} /></a>
        </div>
        <div className="hero-art" aria-label="精选商品视觉陈列">
          <span className="hero-circle" /><span className="hero-card card-one">01<br /><b>发现</b></span><span className="hero-card card-two">02<br /><b>比较</b></span><span className="hero-card card-three">03<br /><b>转化</b></span>
          <p>Discovery<br />is a product<br /><i>decision.</i></p>
        </div>
      </section>

      <section className="discovery" id="discover">
        <div className="section-heading"><div><p className="eyebrow">DISCOVERY LAB / 06 PICKS</p><h2>本周值得遇见</h2></div><p>少一点无效滚动，<br />多一点购买理由。</p></div>
        <div className="filter-bar">
          <label className="search"><Search size={16} /><input aria-label="搜索商品" onChange={(e) => setQuery(e.target.value)} placeholder="搜索商品、场景或标签" value={query} /></label>
          <div className="category-tabs" aria-label="商品分类">{CATEGORIES.map((item) => <button aria-pressed={category === item} key={item} onClick={() => setCategory(item)} type="button">{item}</button>)}</div>
          <label className="market-select"><SlidersHorizontal size={15} /><select aria-label="选择市场" onChange={(e) => setMarket(e.target.value as Market | "ALL")} value={market}>{MARKETS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        </div>
        <div className="results-line"><span>{visible.length} 件精选商品</span><span>实验：{variant === "control" ? "A 对照排序" : "B 价值排序"}</span></div>
        <div className="product-grid">{visible.map((product) => <ProductCard key={product.id} onSelect={openProduct} product={product} />)}</div>
        {visible.length === 0 && <div className="empty-state">没有找到对应商品，试试更宽的筛选条件。</div>}
      </section>

      <InsightPanel variant={variant} />
      <footer id="about"><div><span className="wordmark"><span>ML</span> Market Loom</span><p>基于 Medusa 领域模型设计的作品集演示。</p></div><div><strong>产品边界</strong><p>本页订单与指标均为本地演示数据，不触发真实支付。</p></div><div><strong>数据方案</strong><p>事件命名兼容 PostHog，可替换为真实采集适配器。</p></div></footer>

      {selected && <div className="overlay" role="presentation" onMouseDown={() => setSelected(null)}><section aria-label="商品详情" aria-modal="true" className="detail-sheet" onMouseDown={(e) => e.stopPropagation()} role="dialog"><button aria-label="关闭商品详情" className="icon-button" onClick={() => setSelected(null)} type="button"><X /></button><div className="detail-art" style={{ backgroundColor: selected.color }}><span>{selected.category}</span></div><div className="detail-copy"><p className="eyebrow">{selected.badge} · {selected.market.join(" / ")}</p><h2>{selected.name}</h2><p>{selected.story}</p><ul><li><Check size={15} />本地化含税价格</li><li><Check size={15} />7 天无理由退换</li><li><Check size={15} />预计 2–4 个工作日送达</li></ul><div><strong>{formatPrice(selected.price)}</strong><button onClick={() => addToCart(selected)} type="button">加入购物车 <ArrowRight size={16} /></button></div></div></section></div>}

      {cartOpen && <div className="overlay align-right" role="presentation" onMouseDown={() => setCartOpen(false)}><aside aria-label="购物车" aria-modal="true" className="cart-drawer" onMouseDown={(e) => e.stopPropagation()} role="dialog"><div className="drawer-title"><div><p className="eyebrow">YOUR EDIT</p><h2>购物车 · {cartCount}</h2></div><button aria-label="关闭购物车" className="icon-button" onClick={() => setCartOpen(false)} type="button"><X /></button></div>{orderId ? <div className="order-success"><Check size={28} /><h3>演示订单已创建</h3><p>订单号 {orderId}</p><button onClick={() => { setOrderId(""); setCartOpen(false); }} type="button">继续发现</button></div> : <><div className="cart-lines">{lines.map((line) => <div className="cart-line" key={line.id}><span style={{ backgroundColor: line.color }}>{line.category[0]}</span><div><strong>{line.name}</strong><small>数量 {line.quantity}</small></div><b>{formatPrice(line.price * line.quantity)}</b></div>)}{lines.length === 0 && <p className="cart-empty">购物车还是空的，从一件真正喜欢的商品开始。</p>}</div><div className="cart-summary"><p><span>商品小计</span><b>{formatPrice(totals.items)}</b></p><p><span>配送费</span><b>{totals.shipping ? formatPrice(totals.shipping) : "免运费"}</b></p><p className="total"><span>合计</span><b>{formatPrice(totals.total)}</b></p><button disabled={cartCount === 0} onClick={completeOrder} type="button">模拟结算并下单 <ArrowRight size={16} /></button><small>演示模式：不会收集地址或触发真实支付</small></div></>}</aside></div>}
    </main>
  );
}
