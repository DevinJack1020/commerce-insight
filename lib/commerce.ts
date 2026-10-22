export type CartLine = { price: number; quantity: number };

export function calculateLandedPrice(
  price: number,
  shipping: number,
  taxRate: number
) {
  return Math.round((price + shipping) * (1 + taxRate));
}

export function calculateCart(lines: CartLine[]) {
  const items = lines.reduce(
    (total, line) => total + line.price * Math.max(0, line.quantity),
    0
  );
  const shipping = items === 0 || items >= 19_900 ? 0 : 900;
  return { items, shipping, total: items + shipping };
}

export function formatPrice(value: number, currency = "SGD") {
  return new Intl.NumberFormat("zh-CN", {
    currency,
    style: "currency",
  }).format(value / 100);
}
