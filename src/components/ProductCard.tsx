import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
    toast.success(`${product.title} adicionado`);
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link
      to={`/produto/${product.handle}`}
      className="group flex flex-col bg-background border border-border rounded-xl overflow-hidden hover:shadow-elevated hover:border-primary/40 transition-all"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2.5 py-1 text-xs font-bold rounded-full">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Esgotado
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {product.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">{product.capacity} · {product.material}</p>
        <div className="mt-auto">
          {product.compareAtPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {formatBRL(product.compareAtPrice)}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-foreground">{formatBRL(product.price)}</span>
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="h-9 w-9 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
