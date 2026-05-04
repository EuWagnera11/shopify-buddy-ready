import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

const Products = () => {
  const { data: products = [], isLoading } = useShopifyProducts();
  const [vendor, setVendor] = useState("Todos");
  const [sort, setSort] = useState("featured");

  const vendors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.node.vendor && set.add(p.node.vendor));
    return ["Todos", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let list = vendor === "Todos" ? products : products.filter((p) => p.node.vendor === vendor);
    const price = (p: typeof products[number]) =>
      parseFloat(p.node.priceRange.minVariantPrice.amount);
    if (sort === "price-asc") list = [...list].sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => price(b) - price(a));
    return list;
  }, [products, vendor, sort]);

  return (
    <Layout>
      <section className="border-b border-border py-16">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Coleção completa</p>
          <h1 className="font-display text-5xl md:text-6xl">Embalagens douradas</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Linha completa de frascos, potes e tubos para perfumaria e cosméticos premium.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {vendors.map((v) => (
              <button
                key={v}
                onClick={() => setVendor(v)}
                className={`px-5 py-2 text-xs uppercase tracking-[0.25em] border transition-colors ${
                  vendor === v
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-input border border-border px-4 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
          >
            <option value="featured">Destaques</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">No products found</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Products;
