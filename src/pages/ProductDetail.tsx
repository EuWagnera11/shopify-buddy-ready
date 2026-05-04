import { Layout } from "@/components/Layout";
import { useParams, Link, Navigate } from "react-router-dom";
import { formatBRL } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useState, useMemo } from "react";
import { Minus, Plus, Truck, Shield, Sparkles, ChevronRight, Loader2, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { useShopifyProduct, useShopifyProducts } from "@/hooks/useShopifyProducts";
import { shopifyImg, shopifySrcSet } from "@/lib/image";
import { useSEO } from "@/hooks/useSEO";

const ProductDetail = () => {
  const { handle } = useParams();
  const { data: product, isLoading } = useShopifyProduct(handle);
  const { data: allProducts = [] } = useShopifyProducts();
  const addItem = useCartStore((s) => s.addItem);
  const adding = useCartStore((s) => s.isLoading);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => (product ? s.ids.includes(product.node.id) : false));
  const [qty, setQty] = useState(1);
  const [variantIdx, setVariantIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  const p = product?.node;
  const images = useMemo(() => p?.images.edges.map((e) => e.node) ?? [], [p]);
  const variants = useMemo(() => p?.variants.edges.map((e) => e.node) ?? [], [p]);
  const variant = variants[variantIdx];
  const inStock = !!variant?.availableForSale;
  const price = parseFloat(variant?.price.amount || p?.priceRange.minVariantPrice.amount || "0");

  const jsonLd = useMemo(() => {
    if (!p) return null;
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: p.title,
      description: p.description,
      image: images.map((i) => i.url),
      brand: { "@type": "Brand", name: p.vendor || "Gold Embalagens" },
      sku: variant?.id,
      offers: {
        "@type": "Offer",
        price: variant?.price.amount,
        priceCurrency: variant?.price.currencyCode || "BRL",
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: typeof window !== "undefined" ? window.location.href : "",
      },
    };
  }, [p, variant, images, inStock]);

  useSEO({
    title: p ? `${p.title}${p.vendor ? " · " + p.vendor : ""} · Gold Embalagens` : "Produto · Gold Embalagens",
    description: p?.description?.slice(0, 155) || "Embalagem premium da Gold Embalagens.",
    image: images[0]?.url,
    canonical: typeof window !== "undefined" ? window.location.origin + `/produto/${handle}` : undefined,
    jsonLd,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-32 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  if (!product || !p) return <Navigate to="/produtos" replace />;

  const related = allProducts
    .filter((rp) => rp.node.id !== p.id && (rp.node.vendor === p.vendor || rp.node.productType === p.productType))
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

  const handleBuyNow = async () => {
    await handleAdd();
    setCartOpen(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: p.title, url }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado", { position: "top-center" });
    }
  };

  // Group options by name for swatches
  const optionGroups = p.options || [];

  const selectVariantByOptions = (selected: Record<string, string>) => {
    const idx = variants.findIndex((v) =>
      v.selectedOptions.every((o) => selected[o.name] === o.value)
    );
    if (idx >= 0) setVariantIdx(idx);
  };

  const currentSelected: Record<string, string> = {};
  variant?.selectedOptions.forEach((o) => (currentSelected[o.name] = o.value));

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
          <div
            className="aspect-[4/5] bg-secondary overflow-hidden rounded-lg relative cursor-zoom-in"
            onMouseEnter={() => setZoom((z) => ({ ...z, active: true }))}
            onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setZoom({
                active: true,
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
              });
            }}
          >
            {images[imgIdx] && (
              <img
                src={shopifyImg(images[imgIdx].url, 1200)}
                srcSet={shopifySrcSet(images[imgIdx].url, [600, 900, 1200, 1600])}
                sizes="(min-width:768px) 50vw, 100vw"
                alt={images[imgIdx].altText || p.title}
                className="h-full w-full object-contain p-6 transition-transform duration-200"
                style={
                  zoom.active
                    ? { transform: `scale(2)`, transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : undefined
                }
              />
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
                  <img src={shopifyImg(img.url, 160)} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:py-8">
          {p.vendor && (
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{p.vendor}</p>
          )}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="font-display text-3xl md:text-4xl">{p.title}</h1>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => { toggleWish(p.id); }} aria-label="Favoritar" className="h-10 w-10 flex items-center justify-center border border-border rounded-full hover:border-primary">
                <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : ""}`} />
              </button>
              <button onClick={handleShare} aria-label="Compartilhar" className="h-10 w-10 flex items-center justify-center border border-border rounded-full hover:border-primary">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl text-primary font-medium">{formatBRL(price)}</span>
            <span className="text-xs text-muted-foreground">ou 3x sem juros</span>
          </div>

          {p.description && (
            <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
              {p.description}
            </p>
          )}

          {optionGroups.map((opt) => (
            <div key={opt.name} className="mb-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                {opt.name}: <span className="text-foreground">{currentSelected[opt.name]}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val) => {
                  const selected = currentSelected[opt.name] === val;
                  // is this combination available?
                  const candidate = { ...currentSelected, [opt.name]: val };
                  const candVariant = variants.find((v) =>
                    v.selectedOptions.every((o) => candidate[o.name] === o.value)
                  );
                  const available = candVariant?.availableForSale;
                  return (
                    <button
                      key={val}
                      onClick={() => selectVariantByOptions(candidate)}
                      disabled={!candVariant}
                      className={`px-4 py-2 text-sm border rounded transition-colors ${
                        selected ? "border-primary text-primary bg-primary/5" : "border-border hover:border-primary/50"
                      } ${!available ? "line-through opacity-50" : ""} disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {inStock ? (
            <div className="space-y-3 mb-8">
              <div className="flex flex-wrap items-stretch gap-3">
                <div className="flex items-center border border-border rounded">
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
                  className="flex-1 min-w-[180px] border border-primary text-primary py-4 px-6 uppercase tracking-[0.25em] text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 rounded"
                >
                  {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar ao carrinho"}
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                disabled={adding}
                className="w-full bg-brand-gradient text-primary-foreground py-4 px-8 uppercase tracking-[0.25em] text-xs font-semibold hover:opacity-90 transition-opacity shadow-elevated rounded"
              >
                Comprar agora
              </button>
            </div>
          ) : (
            <button disabled className="w-full bg-secondary text-muted-foreground py-4 uppercase tracking-[0.25em] text-xs mb-8 cursor-not-allowed rounded">
              Esgotado
            </button>
          )}

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-primary" /> Frete grátis em compras acima de R$ 299</li>
            <li className="flex items-center gap-3"><Shield className="h-4 w-4 text-primary" /> Pagamento 100% seguro via Shopify</li>
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
