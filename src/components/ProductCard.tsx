import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";
import { formatBRL } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { ShoppingBag, Loader2, Heart } from "lucide-react";
import { toast } from "sonner";
import { shopifyImg, shopifySrcSet } from "@/lib/image";

export const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(product.node.id));
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const image = p.images.edges[0]?.node;
  const inStock = !!variant?.availableForSale;
  const price = parseFloat(p.priceRange.minVariantPrice.amount);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant || !inStock) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${p.title} adicionado`, { position: "top-center" });
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWish(p.id);
    toast.success(wished ? "Removido dos favoritos" : "Adicionado aos favoritos", { position: "top-center" });
  };

  return (
    <Link
      to={`/produto/${p.handle}`}
      className="group relative flex flex-col bg-background border border-border rounded-xl overflow-hidden hover:shadow-elevated hover:border-primary/40 transition-all"
    >
      <button
        onClick={handleWish}
        aria-label={wished ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        className="absolute top-3 right-3 z-10 h-8 w-8 flex items-center justify-center bg-background/80 backdrop-blur rounded-full hover:bg-background border border-border"
      >
        <Heart className={`h-4 w-4 transition-colors ${wished ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </button>
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        {image && (
          <img
            src={shopifyImg(image.url, 480)}
            srcSet={shopifySrcSet(image.url, [240, 360, 480, 720])}
            sizes="(min-width:1024px) 25vw, 50vw"
            alt={image.altText || p.title}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Esgotado
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {p.vendor && (
          <p className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-1">
            {p.vendor}
          </p>
        )}
        <h3 className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
          {p.title}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-foreground">{formatBRL(price)}</span>
          <button
            onClick={handleAdd}
            disabled={!inStock || isLoading}
            className="h-9 w-9 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Adicionar ao carrinho"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
};
