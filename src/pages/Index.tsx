import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import hero from "@/assets/hero.jpg";
import {
  ArrowRight,
  Leaf,
  Loader2,
  MessageCircle,
  Sparkles,
  Stethoscope,
  Scissors,
  Gift,
  Package,
  Truck,
  Palette,
  Headphones,
  ShieldCheck,
  Award,
} from "lucide-react";
import { useMemo } from "react";

const WHATSAPP_URL = "https://wa.me/5511999999999";

const audiences = [
  {
    icon: Sparkles,
    title: "Marcas indie de cosméticos",
    desc: "Para quem está começando ou escalando: compre poucas unidades, teste fórmulas e personalize sem MOQ alto.",
    cta: "Ver linha cosmética",
  },
  {
    icon: Stethoscope,
    title: "Clínicas e farmácias de manipulação",
    desc: "Frascos âmbar, conta-gotas e potes farmacêuticos com vedação confiável e laudos sob demanda.",
    cta: "Ver linha farmacêutica",
  },
  {
    icon: Scissors,
    title: "Salões e profissionais de beleza",
    desc: "Bisnagas, borrifadores e potes para diluir, fracionar e revender com a sua marca.",
    cta: "Ver linha profissional",
  },
  {
    icon: Gift,
    title: "Brindes e kits corporativos",
    desc: "Embalagens personalizáveis para presentes, welcome kits e ações promocionais com acabamento premium.",
    cta: "Falar com consultor",
  },
];

const reasons = [
  { icon: Package, title: "Pedido mínimo de 1 unidade", desc: "Teste, prototipe e revenda sem precisar comprar grandes lotes." },
  { icon: Truck, title: "Envio em até 48h", desc: "Estoque próprio e logística ágil para todo o Brasil." },
  { icon: Palette, title: "Personalização sob demanda", desc: "Rótulos, silk e cores especiais para a identidade da sua marca." },
  { icon: Headphones, title: "Atendimento técnico", desc: "Time especializado para indicar a embalagem ideal para sua fórmula." },
  { icon: ShieldCheck, title: "Compra 100% segura", desc: "Pagamento protegido e entrega garantida ou seu dinheiro de volta." },
  { icon: Award, title: "Curadoria de fornecedores", desc: "Trabalhamos só com fabricantes auditados, com qualidade comprovada." },
];

const Index = () => {
  const { data: products = [], isLoading } = useShopifyProducts();
  const featured = useMemo(() => products.slice(0, 8), [products]);
  const groupedByType = useMemo(() => {
    const map = new Map<string, typeof products>();
    products.forEach((p) => {
      const type = p.node.productType?.trim() || "Outros";
      if (!map.has(type)) map.set(type, []);
      map.get(type)!.push(p);
    });
    return Array.from(map.entries())
      .filter(([, items]) => items.length > 0)
      .slice(0, 4)
      .map(([type, items]) => ({ type, items: items.slice(0, 4) }));
  }, [products]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-soft-gradient overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-8 items-center py-12 md:py-20">
          <div>
            <span className="inline-block bg-accent text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              Embalagens profissionais · Pedido mínimo: 1 unidade
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-5 text-foreground">
              Frascos, potes e bisnagas que dão{" "}
              <span className="text-primary">margem</span> ao seu negócio.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg">
              Embalagens cosméticas e farmacêuticas para marcas indie, clínicas, salões e brindes.
              Compre a partir de 1 unidade e receba em até 5 dias úteis.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/produtos"
                className="group inline-flex items-center gap-2 bg-brand-gradient px-7 py-3.5 rounded-full text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-elevated"
              >
                Ver catálogo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-border bg-background hover:border-primary hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={hero}
              alt="Embalagens cosméticas e farmacêuticas"
              width={1600}
              height={900}
              className="w-full rounded-2xl shadow-elevated object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* Bullets bar */}
      <section className="bg-brand-gradient text-primary-foreground">
        <div className="container py-4 text-center text-xs md:text-sm font-medium">
          <p className="leading-relaxed">
            Pedido mínimo 1 un <span className="opacity-60 mx-2">·</span>
            Envio em 48h <span className="opacity-60 mx-2">·</span>
            Personalização sob demanda <span className="opacity-60 mx-2">·</span>
            Atendimento técnico
          </p>
        </div>
      </section>

      {/* Destaques */}
      <section className="container py-16 md:py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Destaques</h2>
            <p className="text-muted-foreground mt-1">Seleção das nossas embalagens</p>
          </div>
          <Link
            to="/produtos"
            className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 group"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No products found</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Para quem é a Gold */}
      <section className="container py-16 md:py-20">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Para quem é a Gold</h2>
          <p className="text-muted-foreground">
            Atendemos quem leva a sério a embalagem como parte do produto.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map(({ icon: Icon, title, desc, cta }) => (
            <div
              key={title}
              className="group bg-card border border-border rounded-2xl p-6 flex flex-col shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all"
            >
              <div className="h-32 -mx-6 -mt-6 mb-5 rounded-t-2xl bg-soft-gradient flex items-center justify-center border-b border-border">
                <div className="h-16 w-16 rounded-full bg-brand-gradient flex items-center justify-center shadow-card">
                  <Icon className="h-8 w-8 text-primary-foreground" strokeWidth={1.6} />
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{desc}</p>
              <Link
                to="/produtos"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline"
              >
                {cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Por que a Gold */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container py-16 md:py-20">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Por que a Gold</h2>
            <p className="text-muted-foreground">
              Seis motivos pelos quais centenas de marcas escolhem a Gold Embalagens.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-background border border-border rounded-2xl p-6 flex gap-4 hover:border-primary/40 hover:shadow-card transition-all"
              >
                <div className="h-12 w-12 shrink-0 rounded-full bg-accent flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.7} />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="container py-16 md:py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Nossos produtos</h2>
            <p className="text-muted-foreground mt-1">Seleção das nossas embalagens</p>
          </div>
          <Link
            to="/produtos"
            className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 group"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No products found</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Banner CTA */}
      <section className="container pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center bg-brand-gradient rounded-2xl p-8 md:p-14 text-primary-foreground overflow-hidden">
          <div>
            <span className="inline-block bg-white/15 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Linha sustentável
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Embalagens que respeitam o planeta.
            </h2>
            <p className="opacity-90 mb-6 max-w-md">
              Conheça nossa linha de embalagens recicláveis e biodegradáveis, ideais para marcas
              que valorizam o impacto ambiental.
            </p>
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-white/90"
            >
              Explorar linha eco
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="hidden md:block">
            <Leaf className="h-48 w-48 opacity-20 ml-auto" strokeWidth={1} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
