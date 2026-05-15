import { Layout } from "@/components/Layout";
import { useShopifyCollections } from "@/hooks/useShopifyCollections";
import { Link } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { shopifyImg } from "@/lib/image";

const Collections = () => {
  const { data: collections = [], isLoading } = useShopifyCollections();

  useSEO({
    title: "Coleções · Gold Embalagens",
    description: "Navegue pelas coleções da Gold Embalagens.",
  });

  return (
    <Layout>
      <section className="border-b border-border py-16">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Explore por coleção</p>
          <h1 className="font-display text-5xl md:text-6xl">Coleções</h1>
        </div>
      </section>

      <section className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : collections.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">Nenhuma coleção encontrada</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c) => {
              const cover = c.image || c.fallbackImage;
              return (
                <Link
                  key={c.id}
                  to={`/colecao/${c.handle}`}
                  className="group relative overflow-hidden rounded-xl bg-secondary/40 border border-border hover:border-primary/50 hover:shadow-elevated transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-secondary/40">
                    {cover?.url ? (
                      <img
                        src={shopifyImg(cover.url, 600)}
                        alt={cover.altText || c.title}
                        loading="eager"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
                        {c.title}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl">{c.title}</h3>
                      {c.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Collections;
