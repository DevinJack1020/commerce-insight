import { products, type Product } from "./catalog";

export interface CommerceBackend {
  listProducts(): Promise<Product[]>;
}

export class DemoCommerceBackend implements CommerceBackend {
  async listProducts() {
    return products;
  }
}

// A production adapter can map Medusa Store API product responses to Product.
// Keeping the interface small makes demo data replaceable without changing UI code.
