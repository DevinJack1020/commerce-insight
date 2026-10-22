import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Loom｜跨境商品发现实验室",
  description: "Medusa 兼容的电商商品发现、转化与实验作品集项目",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
