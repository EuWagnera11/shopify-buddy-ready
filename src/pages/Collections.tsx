import { Layout } from "@/components/Layout";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { shopifyImg } from "@/lib/image";
import { slugify } from "./CollectionPage";

const Collections = () => {
  const { data: products = [], isLoading } = useShopifyProducts();

  useSEO({
    title: "Coleções · Gold Embalagens",
    description: "Navegue pelas categorias e linhas de embalagens da Gold.",
  });

  const groups = useMemo(() => {
    const map = new Map<string, { count: number; image?: string }>();
    products.forEach((p) => {
      const type = p.node.productType?.trim() || p.node.vendor?.trim();
      if (!type) return;
      const cur = map.get(type) || { count: 0, image: p.node.images.edges[0]?.node.url };
      map.set(type, { count: cur.count + 1, image: cur.image || p.node.images.edges[0]?.node.url });
    });
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [products]);

  return (
    <Layout>
      <section className="border-b border-border py-16">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Explore por categoria</p>
          <h1 className="font-display text-5xl md:text-6xl">Coleções</h1>
        </div>
      </section>

      <section className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : groups.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">Nenhuma coleção encontrada</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(([type, info]) => (
              <Link
                key={type}
                to={`/colecao/${slugify(type)}`}
                className="group relative overflow-hidden rounded-xl bg-secondary/40 border border-border hover:border-primary/50 hover:shadow-elevated transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {info.image && (
                    <img
                      src={shopifyImg(info.image, 600)}
                      alt={type}
                      loading="lazy"
                      className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl">{type}</h3>
                    <p className="text-xs text-muted-foreground">{info.count} produto{info.count !== 1 ? "s" : ""}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Collections;
