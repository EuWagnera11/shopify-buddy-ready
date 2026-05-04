import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useParams, Link, Navigate } from "react-router-dom";
import { Loader2, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";

interface Props {
  mode: "collection" | "vendor";
}

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CollectionPage = ({ mode }: Props) => {
  const { slug } = useParams();
  const { data: products = [], isLoading } = useShopifyProducts();

  const { items, label } = useMemo(() => {
    if (!slug) return { items: [], label: "" };
    const filtered = products.filter((p) => {
      const key = mode === "vendor" ? p.node.vendor : p.node.productType;
      return key && slugify(key) === slug;
    });
    const label =
      filtered[0]?.node[mode === "vendor" ? "vendor" : "productType"] || slug.replace(/-/g, " ");
    return { items: filtered, label };
  }, [products, slug, mode]);

  useSEO({
    title: `${label} · Gold Embalagens`,
    description: `Explore ${label} na Gold Embalagens. ${items.length} produto(s) disponíveis.`,
    canonical: typeof window !== "undefined" ? window.location.href : undefined,
  });

  if (!isLoading && items.length === 0 && products.length > 0) {
    return <Navigate to="/produtos" replace />;
  }

  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/produtos" className="hover:text-primary">
            {mode === "vendor" ? "Marcas" : "Coleções"}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/60">{label}</span>
        </nav>
      </div>

      <section className="border-b border-border pb-12">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            {mode === "vendor" ? "Marca" : "Categoria"}
          </p>
          <h1 className="font-display text-4xl md:text-5xl capitalize">{label}</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            {items.length} produto{items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <section className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">Nenhum produto nesta coleção</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {items.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default CollectionPage;
export { slugify };
