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

  return (
    <Link to={`/produto/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary mb-4">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.compareAtPrice && (
          <span className="absolute top-3 left-3 bg-brand-gradient px-3 py-1 text-[10px] uppercase tracking-widest text-primary-foreground font-medium">
            Oferta
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Esgotado</span>
          </div>
        )}
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className="absolute bottom-3 right-3 h-11 w-11 flex items-center justify-center bg-background/90 backdrop-blur border border-primary/40 opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-gradient hover:text-primary-foreground disabled:opacity-0"
          aria-label="Adicionar ao carrinho"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{product.category} · {product.capacity}</p>
        <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg text-primary font-medium">{formatBRL(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatBRL(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
