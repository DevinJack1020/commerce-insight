import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterProducts, products } from "../lib/catalog";
import { calculateCart, calculateLandedPrice } from "../lib/commerce";
import { assignExperiment, buildFunnel } from "../lib/analytics";

describe("catalog discovery", () => {
  it("filters products by query, category, and market", () => {
    const result = filterProducts(products, {
      category: "数码",
      market: "SG",
      query: "键盘",
    });
    assert.equal(result.length, 1);
    assert.equal(result[0]?.id, "keyboard-75");
  });
});

describe("commerce calculations", () => {
  it("calculates landed price and cart totals in cents", () => {
    assert.equal(calculateLandedPrice(12_900, 900, 0.08), 14_904);
    assert.deepEqual(calculateCart([{ price: 12_900, quantity: 2 }]), {
      items: 25_800,
      shipping: 0,
      total: 25_800,
    });
  });
});

describe("experiments and funnel", () => {
  it("assigns a visitor deterministically", () => {
    assert.equal(assignExperiment("visitor-42"), assignExperiment("visitor-42"));
  });

  it("builds conversion rates from event counts", () => {
    assert.deepEqual(buildFunnel([100, 62, 31, 19]), [100, 62, 50, 61]);
  });
});
