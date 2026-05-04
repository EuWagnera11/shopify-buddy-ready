import { Layout } from "@/components/Layout";
import { useParams, Link, Navigate } from "react-router-dom";
import { products } from "@/data/products";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Minus, Plus, Truck, Shield, Sparkles, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";

const ProductDetail = () => {
  const { handle } = useParams();
  const product = products.find((p) => p.handle === handle);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return <Navigate to="/produtos" replace />;

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`${product.title} adicionado ao carrinho`);
  };

  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/produtos" className="hover:text-primary">Coleção</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/60 truncate">{product.title}</span>
        </nav>
      </div>

      <section className="container grid md:grid-cols-2 gap-12 lg:gap-20 py-8">
        <div className="aspect-[4/5] bg-secondary overflow-hidden">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
        </div>

        <div className="md:py-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{product.category}</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6">{product.title}</h1>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl text-primary font-medium">{formatBRL(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatBRL(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

          <dl className="grid grid-cols-2 gap-4 py-6 border-y border-border mb-8 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Capacidade</dt>
              <dd>{product.capacity}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Material</dt>
              <dd>{product.material}</dd>
            </div>
          </dl>

          {product.inStock ? (
            <div className="flex flex-wrap items-stretch gap-3 mb-8">
              <div className="flex items-center border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-12 w-12 flex items-center justify-center hover:bg-secondary">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-12 w-12 flex items-center justify-center hover:bg-secondary">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 min-w-[200px] bg-gold-gradient text-primary-foreground py-4 px-8 uppercase tracking-[0.25em] text-xs font-semibold hover:opacity-90 transition-opacity shadow-gold"
              >
                Adicionar ao carrinho
              </button>
            </div>
          ) : (
            <button disabled className="w-full bg-secondary text-muted-foreground py-4 uppercase tracking-[0.25em] text-xs mb-8 cursor-not-allowed">
              Esgotado
            </button>
          )}

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-primary" /> Frete calculado no checkout</li>
            <li className="flex items-center gap-3"><Shield className="h-4 w-4 text-primary" /> Garantia de qualidade</li>
            <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-primary" /> Embalagem premium para envio</li>
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container py-24">
          <h2 className="font-serif text-3xl mb-12">Você também pode gostar</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
