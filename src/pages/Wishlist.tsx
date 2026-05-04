import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const Wishlist = () => {
  const { data: products = [], isLoading } = useShopifyProducts();
  const ids = useWishlistStore((s) => s.ids);
  const items = products.filter((p) => ids.includes(p.node.id));

  useSEO({
    title: "Favoritos · Gold Embalagens",
    description: "Seus produtos favoritos salvos para depois.",
  });

  return (
    <Layout>
      <section className="border-b border-border py-12">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Sua lista</p>
          <h1 className="font-display text-4xl md:text-5xl">Favoritos</h1>
        </div>
      </section>
      <section className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center text-center py-24 gap-4">
            <Heart className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Você ainda não favoritou nenhum produto.</p>
            <Link to="/produtos" className="text-sm uppercase tracking-[0.2em] text-primary hover:underline">
              Explorar coleção
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {items.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Wishlist;
