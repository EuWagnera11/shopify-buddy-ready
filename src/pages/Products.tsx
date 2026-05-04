import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { useState, useMemo } from "react";

const Products = () => {
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = category === "Todos" ? products : products.filter((p) => p.category === category);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, sort]);

  return (
    <Layout>
      <section className="border-b border-border py-16">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Coleção completa</p>
          <h1 className="font-serif text-5xl md:text-6xl">Embalagens douradas</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Linha completa de frascos, potes e tubos para perfumaria e cosméticos premium.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-5 py-2 text-xs uppercase tracking-[0.25em] border transition-colors ${
                  category === c
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {c}
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

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
