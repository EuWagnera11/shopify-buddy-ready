import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useShopifyCollection } from "@/hooks/useShopifyCollections";
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

  // Collection mode: fetch directly from Shopify by handle
  const { data: collectionData, isLoading: collectionLoading } = useShopifyCollection(
    mode === "collection" ? slug : undefined,
  );

  // Vendor mode: filter all products by vendor slug
  const { data: products = [], isLoading: productsLoading } = useShopifyProducts(undefined, 50);

  const { items, label, description } = useMemo(() => {
    if (mode === "collection") {
      return {
        items: collectionData?.products ?? [],
        label: collectionData?.collection.title ?? slug?.replace(/-/g, " ") ?? "",
        description: collectionData?.collection.description ?? "",
      };
    }
    if (!slug) return { items: [], label: "", description: "" };
    const filtered = products.filter((p) => p.node.vendor && slugify(p.node.vendor) === slug);
    return {
      items: filtered,
      label: filtered[0]?.node.vendor || slug.replace(/-/g, " "),
      description: "",
    };
  }, [mode, collectionData, products, slug]);

  const isLoading = mode === "collection" ? collectionLoading : productsLoading;

  useSEO({
    title: `${label} · Gold Embalagens`,
    description: description || `Explore ${label} na Gold Embalagens. ${items.length} produto(s) disponíveis.`,
    canonical: typeof window !== "undefined" ? window.location.href : undefined,
  });

  if (mode === "collection" && !collectionLoading && !collectionData) {
    return <Navigate to="/colecoes" replace />;
  }
  if (mode === "vendor" && !productsLoading && items.length === 0 && products.length > 0) {
    return <Navigate to="/produtos" replace />;
  }

  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={mode === "vendor" ? "/marcas" : "/colecoes"} className="hover:text-primary">
            {mode === "vendor" ? "Marcas" : "Coleções"}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/60">{label}</span>
        </nav>
      </div>

      <section className="border-b border-border pb-12">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            {mode === "vendor" ? "Marca" : "Coleção"}
          </p>
          <h1 className="font-display text-4xl md:text-5xl capitalize">{label}</h1>
          {description && (
            <p className="text-muted-foreground mt-3 text-sm max-w-2xl">{description}</p>
          )}
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
