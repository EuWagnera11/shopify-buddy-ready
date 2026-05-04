import { Layout } from "@/components/Layout";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { slugify } from "./CollectionPage";

const Brands = () => {
  const { data: products = [], isLoading } = useShopifyProducts();

  useSEO({
    title: "Marcas · Gold Embalagens",
    description: "Conheça as marcas parceiras da Gold Embalagens.",
  });

  const vendors = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      if (!p.node.vendor) return;
      map.set(p.node.vendor, (map.get(p.node.vendor) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [products]);

  return (
    <Layout>
      <section className="border-b border-border py-16">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Fabricantes parceiros</p>
          <h1 className="font-display text-5xl md:text-6xl">Marcas</h1>
        </div>
      </section>

      <section className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : vendors.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">Nenhuma marca encontrada</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendors.map(([vendor, count]) => (
              <Link
                key={vendor}
                to={`/marca/${slugify(vendor)}`}
                className="group bg-secondary/40 hover:bg-accent border border-border rounded-xl p-6 text-center transition-all hover:shadow-card hover:-translate-y-1"
              >
                <h3 className="font-display text-lg mb-1">{vendor}</h3>
                <p className="text-xs text-muted-foreground">{count} produto{count !== 1 ? "s" : ""}</p>
                <ArrowRight className="h-4 w-4 text-primary mx-auto mt-3 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Brands;
