import { Layout } from "@/components/Layout";
import { useParams, Link, Navigate } from "react-router-dom";
import { formatBRL } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";
import { Minus, Plus, Truck, Shield, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { useShopifyProduct, useShopifyProducts } from "@/hooks/useShopifyProducts";

const ProductDetail = () => {
  const { handle } = useParams();
  const { data: product, isLoading } = useShopifyProduct(handle);
  const { data: allProducts = [] } = useShopifyProducts();
  const addItem = useCartStore((s) => s.addItem);
  const adding = useCartStore((s) => s.isLoading);
  const [qty, setQty] = useState(1);
  const [variantIdx, setVariantIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-32 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) return <Navigate to="/produtos" replace />;

  const p = product.node;
  const variants = p.variants.edges.map((e) => e.node);
  const variant = variants[variantIdx];
  const images = p.images.edges.map((e) => e.node);
  const inStock = !!variant?.availableForSale;
  const price = parseFloat(variant?.price.amount || p.priceRange.minVariantPrice.amount);

  const related = allProducts
    .filter((rp) => rp.node.id !== p.id && rp.node.vendor === p.vendor)
    .slice(0, 4);

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${p.title} adicionado ao carrinho`, { position: "top-center" });
  };

  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/produtos" className="hover:text-primary">Coleção</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/60 truncate">{p.title}</span>
        </nav>
      </div>

      <section className="container grid md:grid-cols-2 gap-12 lg:gap-20 py-8">
        <div>
          <div className="aspect-[4/5] bg-secondary overflow-hidden rounded-lg">
            {images[imgIdx] && (
              <img src={images[imgIdx].url} alt={images[imgIdx].altText || p.title} className="h-full w-full object-contain p-6" />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-square bg-secondary rounded overflow-hidden border-2 ${imgIdx === i ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:py-8">
          {p.vendor && (
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{p.vendor}</p>
          )}
          <h1 className="font-display text-3xl md:text-4xl mb-6">{p.title}</h1>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl text-primary font-medium">{formatBRL(price)}</span>
          </div>

          {p.description && (
            <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
              {p.description}
            </p>
          )}

          {variants.length > 1 && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Variante
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantIdx(i)}
                    disabled={!v.availableForSale}
                    className={`px-4 py-2 text-sm border rounded transition-colors ${
                      variantIdx === i
                        ? "border-primary text-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {inStock ? (
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
                disabled={adding}
                className="flex-1 min-w-[200px] bg-brand-gradient text-primary-foreground py-4 px-8 uppercase tracking-[0.25em] text-xs font-semibold hover:opacity-90 transition-opacity shadow-elevated flex items-center justify-center gap-2"
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar ao carrinho"}
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
          <h2 className="font-display text-3xl mb-12">Você também pode gostar</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {related.map((rp) => <ProductCard key={rp.node.id} product={rp} />)}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
