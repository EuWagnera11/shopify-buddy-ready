import { Layout } from "@/components/Layout";
import { useParams, Link, Navigate } from "react-router-dom";
import { formatBRL } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useState, useMemo } from "react";
import {
  Truck,
  Shield,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Heart,
  Share2,
  MessageCircle,
  Sparkles,
  Stethoscope,
  Gift,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { useShopifyProduct, useShopifyProducts } from "@/hooks/useShopifyProducts";
import { shopifyImg, shopifySrcSet } from "@/lib/image";
import { useSEO } from "@/hooks/useSEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { findCopy } from "@/lib/productCopies";

const WHATSAPP_NUMBER = "5511916292626"; // placeholder

// Parse a Shopify variant title like "6 unidades branco" -> { qty: 6, color: "branco" }
const parseQtyFromTitle = (title: string): number => {
  const m = title?.match(/\d+/);
  return m ? parseInt(m[0], 10) : 1;
};

const KNOWN_COLORS = [
  "branco", "preto", "transparente", "âmbar", "ambar", "fosco", "translúcido", "translucido",
  "dourado", "prateado", "rosé", "rose", "azul", "verde", "vermelho", "rosa", "natural", "cristal",
];

const stripAccents = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const parseVariantTitle = (title: string): { qty: number; color: string | null; qtyLabel: string } => {
  const raw = (title || "").trim();
  // Quantity: number followed (optionally) by "un", "unidade(s)", "kit"
  const qtyMatch = raw.match(/(\d+)\s*(unidades?|un\b|uni\b|kit)?/i);
  const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
  const qtyLabel = qtyMatch ? qtyMatch[0].trim() : `${qty}`;

  const norm = stripAccents(raw);
  const found = KNOWN_COLORS.find((c) => {
    const cn = stripAccents(c);
    return new RegExp(`\\b${cn}\\b`).test(norm);
  });
  let color: string | null = found ?? null;

  if (!color) {
    // Fallback: take last word that's not a number/unit
    const tokens = raw
      .replace(/[\/|,;]/g, " ")
      .split(/\s+/)
      .filter((t) => t && !/^\d+$/.test(t) && !/^(unidades?|un|uni|kit)$/i.test(t));
    if (tokens.length) color = tokens[tokens.length - 1].toLowerCase();
  }
  return { qty, color, qtyLabel: qtyLabel.replace(/\s+/g, " ") };
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ProductDetail = () => {
  const { handle } = useParams();
  const { data: product, isLoading } = useShopifyProduct(handle);
  const { data: allProducts = [] } = useShopifyProducts();
  const addItem = useCartStore((s) => s.addItem);
  const adding = useCartStore((s) => s.isLoading);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => (product ? s.ids.includes(product.node.id) : false));
  const [imgIdx, setImgIdx] = useState(0);

  const p = product?.node;
  const images = useMemo(() => p?.images.edges.map((e) => e.node) ?? [], [p]);
  const variants = useMemo(() => p?.variants.edges.map((e) => e.node) ?? [], [p]);

  const parsedVariants = useMemo(
    () =>
      variants.map((v) => {
        const { qty, color, qtyLabel } = parseVariantTitle(v.title);
        const price = parseFloat(v.price.amount);
        return {
          variant: v,
          qty,
          color,
          qtyLabel,
          price,
          unit: qty > 0 ? price / qty : price,
        };
      }),
    [variants]
  );

  // Distinct quantities and colors (preserve first-seen order)
  const quantities = useMemo(() => {
    const seen = new Map<number, string>();
    parsedVariants.forEach((p) => {
      if (!seen.has(p.qty)) seen.set(p.qty, p.qtyLabel);
    });
    return Array.from(seen.entries()).map(([qty, label]) => ({ qty, label }));
  }, [parsedVariants]);

  const colors = useMemo(() => {
    const set = new Set<string>();
    parsedVariants.forEach((p) => {
      if (p.color) set.add(p.color);
    });
    return Array.from(set);
  }, [parsedVariants]);

  const [selectedQty, setSelectedQty] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Initialize defaults once we know the variants
  const defaultQty = quantities[0]?.qty ?? null;
  const defaultColor = colors[0] ?? null;
  const activeQty = selectedQty ?? defaultQty;
  const activeColor = selectedColor ?? defaultColor;

  const matched = useMemo(() => {
    if (activeQty == null) return parsedVariants[0];
    return (
      parsedVariants.find(
        (p) => p.qty === activeQty && (colors.length === 0 || p.color === activeColor)
      ) ??
      parsedVariants.find((p) => p.qty === activeQty) ??
      parsedVariants[0]
    );
  }, [parsedVariants, activeQty, activeColor, colors.length]);

  const variant = matched?.variant ?? variants[0];
  const inStock = !!variant?.availableForSale;
  const kitQty = matched?.qty ?? 1;
  const unitPrice = matched?.unit ?? parseFloat(p?.priceRange.minVariantPrice.amount || "0");
  const total = matched?.price ?? unitPrice * kitQty;

  // Helper: which colors are available for the active qty
  const colorAvailableForQty = (color: string) =>
    parsedVariants.some((p) => p.qty === activeQty && p.color === color && p.variant.availableForSale);
  const qtyAvailableForColor = (qty: number) =>
    colors.length === 0
      ? parsedVariants.some((p) => p.qty === qty && p.variant.availableForSale)
      : parsedVariants.some((p) => p.qty === qty && p.color === activeColor && p.variant.availableForSale);

  const jsonLd = useMemo(() => {
    if (!p) return null;
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: p.title,
      description: p.description,
      image: images.map((i) => i.url),
      brand: { "@type": "Brand", name: "Gold Embalagens" },
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
    title: p ? `${p.title} · Gold Embalagens` : "Produto · Gold Embalagens",
    description: p?.description?.slice(0, 155) || "Embalagem profissional da Gold Embalagens.",
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
    .filter((rp) => rp.node.id !== p.id && (rp.node.productType === p.productType))
    .slice(0, 4);
  const sameLine = allProducts
    .filter((rp) => rp.node.id !== p.id)
    .slice(0, 3);

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${variant.title} adicionado`, { position: "top-center" });
  };

  const handleBuyNow = async () => {
    await handleAdd();
    setCartOpen(true);
  };

  const handleWhatsApp = () => {
    const msg = `Olá! Gostaria de cotar o produto: ${p.title} (qtd: ${kitQty}). Link: ${window.location.href}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: p.title, url }); } catch { /* noop */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado", { position: "top-center" });
    }
  };

  const copy = findCopy(p.title, p.handle);

  // Specs: prefer copy specs, fallback to product options
  const optionSpecs = (p.options || []).map((o) => ({
    label: o.name,
    value: o.values.join(", "),
  }));
  const specs = [
    ...(copy?.specs ?? []),
    ...(copy ? [] : optionSpecs),
    { label: "Vendido por", value: "Gold Embalagens" },
  ];

  const description = copy?.description || p.description;

  const faq = [
    { q: "Esse produto é compatível com cosmético oleoso?", a: "Sim. O material é resistente a fórmulas oleosas comuns em cosméticos. Para fórmulas agressivas, recomendamos teste prévio." },
    { q: "Posso esterilizar em autoclave?", a: "Polipropileno (PP) suporta esterilização química. Para autoclave, consulte nosso atendimento técnico." },
    { q: "Vocês fornecem laudo técnico?", a: "Sim, mediante solicitação para pedidos a partir de 100 unidades." },
    { q: "Qual o prazo de entrega para minha região?", a: "Enviamos em 24-48h. O prazo de transporte varia: Sudeste 2-3 dias úteis, Sul/Centro-Oeste 3-5 dias, Norte/Nordeste 5-8 dias." },
    { q: "Tem desconto para pedidos acima de 500 unidades?", a: "Sim. Solicite orçamento personalizado pelo WhatsApp para volumes acima de 500 un." },
  ];

  return (
    <Layout>
      <div className="container py-3 md:py-6">
        <nav className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/produtos" className="hover:text-primary">Coleção</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/60 truncate">{p.title}</span>
        </nav>
      </div>

      <section className="container grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 py-2 md:py-4 items-start pb-28 md:pb-4">
        {/* GALERIA — sticky */}
        <div className="md:sticky md:top-24">
          <div className="aspect-square bg-secondary/40 overflow-hidden rounded-xl relative">
            {images[imgIdx] && (
              <img
                src={shopifyImg(images[imgIdx].url, 1200)}
                srcSet={shopifySrcSet(images[imgIdx].url, [600, 900, 1200, 1600])}
                sizes="(min-width:768px) 50vw, 100vw"
                alt={images[imgIdx].altText || p.title}
                className="h-full w-full object-contain p-6"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-square bg-secondary/40 rounded-md overflow-hidden border-2 ${imgIdx === i ? "border-primary" : "border-transparent"}`}
                >
                  <img src={shopifyImg(img.url, 160)} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUNA DE COMPRA */}
        <div className="md:py-2 space-y-6">
          {/* CABEÇALHO */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Vendido por Gold Embalagens
            </p>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-display text-3xl md:text-4xl leading-tight">{p.title}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleWish(p.id)} aria-label="Favoritar" className="h-10 w-10 flex items-center justify-center border border-border rounded-full hover:border-primary">
                  <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : ""}`} />
                </button>
                <button onClick={handleShare} aria-label="Compartilhar" className="h-10 w-10 flex items-center justify-center border border-border rounded-full hover:border-primary">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className={inStock ? "text-emerald-700" : "text-destructive"}>
                {inStock ? "● Em estoque" : "Indisponível"}
              </span>
              <span className="text-foreground/30">·</span>
              <span>Envio em 24-48h</span>
              <span className="text-foreground/30">·</span>
              <span className="text-muted-foreground/70">Sem avaliações ainda</span>
            </div>
          </div>

          {copy?.subtitle && (
            <p className="text-foreground/80 leading-relaxed italic border-l-2 border-primary pl-4">
              {copy.subtitle}
            </p>
          )}

          {/* SELETOR DE QUANTIDADE */}
          {quantities.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Escolha a quantidade
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quantities.map((q) => {
                  const selected = q.qty === activeQty;
                  const disabled = !qtyAvailableForColor(q.qty);
                  const repr =
                    parsedVariants.find(
                      (pp) => pp.qty === q.qty && (colors.length === 0 || pp.color === activeColor)
                    ) ?? parsedVariants.find((pp) => pp.qty === q.qty)!;
                  return (
                    <button
                      key={q.qty}
                      onClick={() => setSelectedQty(q.qty)}
                      disabled={disabled}
                      className={`text-left p-3 rounded-lg border-2 transition-all ${
                        selected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50"
                      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <p className={`text-xs uppercase tracking-wider font-semibold ${selected ? "text-primary" : "text-muted-foreground"}`}>
                        {q.qty} un
                      </p>
                      <p className="text-base font-bold mt-1">{formatBRL(repr.price)}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatBRL(repr.unit)}/un
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SELETOR DE COR */}
          {colors.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Cor: <span className="text-foreground font-medium normal-case tracking-normal">{cap(activeColor || "")}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const selected = c === activeColor;
                  const disabled = !colorAvailableForQty(c);
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      disabled={disabled}
                      className={`px-4 py-2 rounded-full border-2 text-xs uppercase tracking-wider font-semibold transition-all ${
                        selected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50 text-muted-foreground"
                      } ${disabled ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                    >
                      {cap(c)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PREÇO + CTAs */}
          <div className="rounded-xl border border-border bg-secondary/20 p-5">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl text-primary font-medium">{formatBRL(total)}</span>
              <span className="text-xs text-muted-foreground">total · {kitQty} un</span>
            </div>

            {inStock ? (
              <div className="space-y-2 hidden md:block">
                <button
                  onClick={handleBuyNow}
                  disabled={adding}
                  className="w-full bg-brand-gradient text-primary-foreground py-4 px-8 uppercase tracking-[0.2em] text-xs font-semibold hover:opacity-90 transition-opacity shadow-elevated rounded-md"
                >
                  {adding ? <Loader2 className="h-4 w-4 animate-spin inline" /> : `Comprar agora — ${formatBRL(total)}`}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="border border-primary text-primary py-3 px-4 uppercase tracking-[0.15em] text-xs font-semibold hover:bg-primary/5 transition-colors rounded-md"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 border border-[#25D366] text-[#1ebe5d] py-3 px-4 uppercase tracking-[0.15em] text-xs font-semibold hover:bg-[#25D366]/5 transition-colors rounded-md"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <button disabled className="w-full bg-secondary text-muted-foreground py-4 uppercase tracking-[0.25em] text-xs cursor-not-allowed rounded-md">
                Esgotado
              </button>
            )}
          </div>

          {/* TRUST BADGES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-4 border-y border-border text-xs">
            <div className="flex items-center gap-2 text-muted-foreground"><Truck className="h-4 w-4 text-primary" /> Envio 24h</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Truck className="h-4 w-4 text-primary" /> Frete grátis +R$299</div>
            <div className="flex items-center gap-2 text-muted-foreground"><RefreshCw className="h-4 w-4 text-primary" /> Troca em 7 dias</div>
            <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary" /> Vedação testada</div>
          </div>

          {/* DIFERENCIAIS */}
          {copy?.differentials && copy.differentials.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-primary mb-3 font-semibold">
                Diferenciais
              </p>
              <ul className="space-y-2">
                {copy.differentials.map((d, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* TABS: descrição / specs / benefícios / FAQ */}
      <section className="container py-12">
        <Tabs defaultValue="descricao" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto h-auto bg-transparent border-b border-border rounded-none p-0 gap-2">
            <TabsTrigger value="descricao" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">Descrição</TabsTrigger>
            <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">Especificações</TabsTrigger>
            {copy?.benefits && copy.benefits.length > 0 && (
              <TabsTrigger value="beneficios" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">Benefícios</TabsTrigger>
            )}
            <TabsTrigger value="faq" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="descricao" className="pt-8">
            <div className="grid gap-8">
              <div>
                {description ? (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
                ) : (
                  <p className="text-muted-foreground">Sem descrição disponível.</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="pt-8">
            <table className="w-full text-sm border border-border rounded-md overflow-hidden max-w-3xl">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
                    <td className="px-4 py-2.5 text-muted-foreground w-1/2">{s.label}</td>
                    <td className="px-4 py-2.5 font-medium">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          {copy?.benefits && copy.benefits.length > 0 && (
            <TabsContent value="beneficios" className="pt-8">
              <div className="grid md:grid-cols-2 gap-3">
                {copy.benefits.map((b, i) => (
                  <div key={i} className="flex gap-3 p-4 border border-border rounded-lg bg-secondary/20">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/85">{b}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="faq" className="pt-8">
            <Accordion type="single" collapsible className="border border-border rounded-xl px-4 max-w-3xl">
              {faq.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="last:border-b-0">
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </section>

      {/* PARA QUEM É */}
      <section className="container py-8">
        <h2 className="font-display text-2xl mb-6">Para quem é este produto</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: "Marcas independentes", desc: "Para envasar cremes, séruns e linhas autorais com acabamento profissional." },
            { icon: Stethoscope, title: "Clínicas e salões", desc: "Entrega de amostras, manipulados e produtos pós-procedimento." },
            { icon: Gift, title: "Brindes corporativos", desc: "Kits personalizados com formulações exclusivas para sua marca." },
          ].map((item) => (
            <div key={item.title} className="border border-border rounded-xl p-5">
              <item.icon className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CROSS-SELL "Combine com" */}
      {related.length > 0 && (
        <section className="container py-12">
          <h2 className="font-display text-2xl mb-6">Combine com</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.slice(0, 3).map((rp) => <ProductCard key={rp.node.id} product={rp} />)}
          </div>
        </section>
      )}

      {/* AVALIAÇÕES — UI vazia (sem reviews fake) */}
      <section className="container py-12 border-t border-border">
        <h2 className="font-display text-2xl mb-6">Avaliações</h2>
        <div className="border border-border rounded-xl p-8 text-center">
          <div className="flex justify-center gap-1 mb-3">
            {[1,2,3,4,5].map((i) => <Star key={i} className="h-5 w-5 text-muted-foreground/30" />)}
          </div>
          <p className="text-muted-foreground mb-1">Nenhuma avaliação ainda.</p>
          <p className="text-sm text-muted-foreground/70">Seja o primeiro a avaliar este produto após sua compra.</p>
        </div>
      </section>

      {/* RODAPÉ DE PRODUTOS */}
      {sameLine.length > 0 && (
        <section className="container py-12">
          <h2 className="font-display text-2xl mb-6">Quem viu isso também viu</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {sameLine.map((rp) => <ProductCard key={rp.node.id} product={rp} />)}
          </div>
        </section>
      )}

      {/* MOBILE STICKY BUY BAR */}
      {inStock && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border p-3 shadow-elevated">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{kitQty} un</p>
              <p className="text-base font-bold text-primary">{formatBRL(total)}</p>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={adding}
              className="flex-[2] bg-brand-gradient text-primary-foreground py-3 px-4 uppercase tracking-[0.15em] text-xs font-semibold rounded-md"
            >
              {adding ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Comprar agora"}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductDetail;
