export type Market = "SG" | "MY" | "PH";

export type Product = {
  badge: string;
  category: "居家" | "数码" | "穿搭";
  color: string;
  id: string;
  market: Market[];
  name: string;
  price: number;
  rating: number;
  reviews: number;
  story: string;
};

export const products: Product[] = [
  {
    badge: "本周热选",
    category: "数码",
    color: "#d9e7dc",
    id: "keyboard-75",
    market: ["SG", "MY"],
    name: "Luma 75 机械键盘",
    price: 12_900,
    rating: 4.8,
    reviews: 328,
    story: "紧凑布局、柔和手感与三模连接，让小桌面也能保持从容。",
  },
  {
    badge: "低碳包装",
    category: "居家",
    color: "#ead9c4",
    id: "linen-lamp",
    market: ["SG", "MY", "PH"],
    name: "亚麻织光台灯",
    price: 8_600,
    rating: 4.7,
    reviews: 184,
    story: "把暮色般的暖光留在书桌，灯罩采用可替换亚麻织物。",
  },
  {
    badge: "编辑推荐",
    category: "穿搭",
    color: "#d6d4c7",
    id: "canvas-bag",
    market: ["SG", "PH"],
    name: "港湾帆布通勤包",
    price: 7_200,
    rating: 4.9,
    reviews: 509,
    story: "电脑、雨伞和一整天的随身物品，都有清楚的位置。",
  },
  {
    badge: "新加坡直发",
    category: "数码",
    color: "#cbdbe1",
    id: "pocket-speaker",
    market: ["SG"],
    name: "Tide 口袋音箱",
    price: 6_900,
    rating: 4.6,
    reviews: 97,
    story: "防泼水机身与十二小时续航，适合阳台、野餐和周末旅行。",
  },
  {
    badge: "回购率 31%",
    category: "居家",
    color: "#e8d8d1",
    id: "aroma-set",
    market: ["MY", "PH"],
    name: "雨林香氛组合",
    price: 5_400,
    rating: 4.8,
    reviews: 241,
    story: "以雨后树皮、柚叶与白茶构成三个层次清晰的居家片刻。",
  },
  {
    badge: "限量色",
    category: "穿搭",
    color: "#e2ccb7",
    id: "weekend-cap",
    market: ["SG", "MY", "PH"],
    name: "Weekend 轻量帽",
    price: 3_800,
    rating: 4.5,
    reviews: 76,
    story: "轻薄、快干、可折叠，颜色来自南洋城市的旧墙与晚霞。",
  },
];

type Filters = { category: string; market: Market | "ALL"; query: string };

export function filterProducts(items: Product[], filters: Filters) {
  const query = filters.query.trim().toLocaleLowerCase("zh-CN");
  return items.filter((product) => {
    const matchesCategory =
      filters.category === "全部" || product.category === filters.category;
    const matchesMarket =
      filters.market === "ALL" || product.market.includes(filters.market);
    const searchable = `${product.name} ${product.story} ${product.badge}`.toLocaleLowerCase(
      "zh-CN"
    );
    return matchesCategory && matchesMarket && searchable.includes(query);
  });
}
