import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import hero from "@/assets/hero.jpg";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";

const Index = () => {
  const featured = products.filter((p) => p.featured);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[600px] flex items-center overflow-hidden">
        <img
          src={hero}
          alt="Embalagens douradas premium"
          width={1600}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-overlay-gradient" />
        <div className="container relative z-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-primary mb-6">
            Coleção 2026 · Edição Aurum
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
            <span className="text-gold-gradient">Embalagens</span>
            <br />
            que vestem o luxo.
          </h1>
          <p className="text-lg text-foreground/80 max-w-xl mb-10 leading-relaxed">
            Frascos, potes e tubos dourados desenhados para marcas de perfumaria
            e cosméticos que não aceitam menos do que extraordinário.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/produtos"
              className="group inline-flex items-center gap-3 bg-gold-gradient px-8 py-4 text-xs uppercase tracking-[0.3em] text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-gold"
            >
              Explorar coleção
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/sobre"
              className="inline-flex items-center px-8 py-4 text-xs uppercase tracking-[0.3em] border border-border hover:border-primary hover:text-primary transition-colors"
            >
              Nossa história
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-secondary/20">
        <div className="container grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { icon: Sparkles, title: "Acabamento Premium", desc: "Acabamentos dourados de alta durabilidade" },
            { icon: Shield, title: "Qualidade Garantida", desc: "Controle artesanal em cada peça" },
            { icon: Truck, title: "Envio Nacional", desc: "Entrega para todo o Brasil" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="py-8 px-6 flex items-center gap-4">
              <Icon className="h-8 w-8 text-primary shrink-0" strokeWidth={1.2} />
              <div>
                <h3 className="font-serif text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Selecionados</p>
            <h2 className="font-serif text-4xl md:text-5xl">Em destaque</h2>
          </div>
          <Link
            to="/produtos"
            className="text-xs uppercase tracking-[0.25em] hover:text-primary inline-flex items-center gap-2 group"
          >
            Ver tudo <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Editorial */}
      <section className="container pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center bg-secondary/30 p-8 md:p-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Manifesto</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              O ouro <span className="text-gold-gradient">não é um material.</span> É uma intenção.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Cada embalagem é pensada para ser parte da narrativa do produto.
              Trabalhamos com fornecedores selecionados e processos artesanais
              para entregar peças que elevam marcas premium a um novo patamar.
            </p>
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-primary group"
            >
              Conheça o estúdio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="aspect-square overflow-hidden">
            <img src={hero} alt="Estúdio Gold" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
