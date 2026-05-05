import copies from "@/data/productCopies.json";

export interface ProductCopy {
  title: string;
  slug: string;
  sku: string;
  subtitle: string;
  description: string;
  differentials: string[];
  specs: { label: string; value: string }[];
  benefits: string[];
}

const normalize = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

const list = copies as ProductCopy[];
const byKey = new Map<string, ProductCopy>();
list.forEach((c) => byKey.set(normalize(c.title), c));

export const findCopy = (productTitle?: string, productHandle?: string): ProductCopy | null => {
  if (!productTitle && !productHandle) return null;
  if (productTitle) {
    const k = normalize(productTitle);
    if (byKey.has(k)) return byKey.get(k)!;
    // fuzzy: longest prefix match
    for (const [key, val] of byKey) {
      if (key.startsWith(k.slice(0, 40)) || k.startsWith(key.slice(0, 40))) return val;
    }
  }
  if (productHandle) {
    const hk = normalize(productHandle);
    for (const [key, val] of byKey) {
      if (key.startsWith(hk.slice(0, 30)) || hk.startsWith(key.slice(0, 30))) return val;
    }
  }
  return null;
};
