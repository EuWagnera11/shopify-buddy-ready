import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useState, useMemo, useEffect } from "react";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const { data: products = [], isLoading } = useShopifyProducts();
  const [vendor, setVendor] = useState("Todos");
  const [type, setType] = useState("Todos");
  const [sort, setSort] = useState("featured");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [search, setSearch] = useState(urlQuery);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => setSearch(urlQuery), [urlQuery]);

  useSEO({
    title: "Produtos · Gold Embalagens",
    description: "Catálogo completo de embalagens cosméticas, farmacêuticas e profissionais.",
    canonical: window.location.origin + "/produtos",
  });

  const vendors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.node.vendor && set.add(p.node.vendor));
    return ["Todos", ...Array.from(set).sort()];
  }, [products]);

  const types = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.node.productType && set.add(p.node.productType));
    return ["Todos", ...Array.from(set).sort()];
  }, [products]);

  const maxStorePrice = useMemo(() => {
    let m = 0;
    products.forEach((p) => {
      const v = parseFloat(p.node.priceRange.minVariantPrice.amount);
      if (v > m) m = v;
    });
    return Math.ceil(m);
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (vendor !== "Todos") list = list.filter((p) => p.node.vendor === vendor);
    if (type !== "Todos") list = list.filter((p) => p.node.productType === type);
    if (onlyAvailable) list = list.filter((p) => p.node.variants.edges.some((v) => v.node.availableForSale));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.node.title.toLowerCase().includes(q) ||
          p.node.vendor?.toLowerCase().includes(q) ||
          p.node.productType?.toLowerCase().includes(q) ||
          p.node.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (priceMax != null) {
      list = list.filter((p) => parseFloat(p.node.priceRange.minVariantPrice.amount) <= priceMax);
    }
    const price = (p: typeof products[number]) => parseFloat(p.node.priceRange.minVariantPrice.amount);
    if (sort === "price-asc") list = [...list].sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => price(b) - price(a));
    if (sort === "name") list = [...list].sort((a, b) => a.node.title.localeCompare(b.node.title));
    return list;
  }, [products, vendor, type, sort, onlyAvailable, search, priceMax]);

  const clearAll = () => {
    setVendor("Todos");
    setType("Todos");
    setOnlyAvailable(false);
    setSearch("");
    setPriceMax(null);
    setSort("featured");
    setSearchParams({});
  };

  const activeFilters =
    (vendor !== "Todos" ? 1 : 0) +
    (type !== "Todos" ? 1 : 0) +
    (onlyAvailable ? 1 : 0) +
    (search ? 1 : 0) +
    (priceMax != null ? 1 : 0);

  return (
    <Layout>
      <section className="border-b border-border py-16">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Coleção completa</p>
          <h1 className="font-display text-5xl md:text-6xl">Embalagens</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Linha completa de frascos, potes e tubos para perfumaria, cosméticos e farmacêutico.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, marca, tag…"
              className="flex-1 bg-secondary/60 border border-border rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-primary focus:bg-background"
            />
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-full text-xs uppercase tracking-widest hover:border-primary"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros {activeFilters > 0 && <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-[10px]">{activeFilters}</span>}
            </button>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-input border border-border rounded-full px-4 py-2.5 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
          >
            <option value="featured">Destaques</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="name">Nome (A→Z)</option>
          </select>
        </div>

        {showFilters && (
          <div className="bg-secondary/30 border border-border rounded-xl p-6 mb-8 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Marca</p>
              <div className="flex flex-wrap gap-2">
                {vendors.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVendor(v)}
                    className={`px-4 py-1.5 text-xs uppercase tracking-wider border rounded-full transition-colors ${
                      vendor === v ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >{v}</button>
                ))}
              </div>
            </div>
            {types.length > 1 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Categoria</p>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-4 py-1.5 text-xs uppercase tracking-wider border rounded-full transition-colors ${
                        type === t ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>
            )}
            {maxStorePrice > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Preço máx: {priceMax != null ? `R$ ${priceMax}` : "qualquer"}
                </p>
                <input
                  type="range"
                  min={1}
                  max={maxStorePrice}
                  value={priceMax ?? maxStorePrice}
                  onChange={(e) => setPriceMax(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="accent-primary" />
              Apenas em estoque
            </label>
            {activeFilters > 0 && (
              <button onClick={clearAll} className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-primary hover:underline">
                <X className="h-3 w-3" /> Limpar filtros
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground mb-6">{filtered.length} produto{filtered.length !== 1 ? "s" : ""}</p>

        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">Nenhum produto encontrado</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Products;
