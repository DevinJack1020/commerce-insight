import { ArrowUpRight, Star } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/commerce";

type Props = { onSelect: (product: Product) => void; product: Product };

export function ProductCard({ onSelect, product }: Props) {
  return (
    <article className="product-card">
      <button
        aria-label={`查看 ${product.name}`}
        className="product-art"
        onClick={() => onSelect(product)}
        style={{ backgroundColor: product.color }}
        type="button"
      >
        <span className="art-orbit" />
        <span className="art-object">{product.category.slice(0, 1)}</span>
        <span className="product-badge">{product.badge}</span>
      </button>
      <div className="product-copy">
        <p className="product-meta">
          {product.category} · {product.market.join(" / ")}
        </p>
        <button className="product-title" onClick={() => onSelect(product)} type="button">
          {product.name}
          <ArrowUpRight aria-hidden="true" size={17} />
        </button>
        <p className="product-story">{product.story}</p>
        <div className="product-footer">
          <strong>{formatPrice(product.price)}</strong>
          <span>
            <Star aria-hidden="true" fill="currentColor" size={13} />
            {product.rating} ({product.reviews})
          </span>
        </div>
      </div>
    </article>
  );
}
