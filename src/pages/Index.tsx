import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import hero from "@/assets/hero.jpg";
import { ArrowRight, Leaf, Beaker, Sparkles, SprayCan } from "lucide-react";

const categoryIcons: Record<string, typeof Leaf> = {
  "Cosmético": Sparkles,
  "Farmacêutico": Beaker,
  "Linha Profissional": SprayCan,
  "Sustentáveis": Leaf,
};

const Index = () => {
  const featured = products.filter((p) => p.featured);
  const navCats = categories.filter((c) => c !== "Todos");

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-soft-gradient overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-8 items-center py-12 md:py-20">
          <div>
            <span className="inline-block bg-accent text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              Lançamento · Linha 2026
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-5 text-foreground">
              Embalagens para cada{" "}
              <span className="text-primary">segmento</span> do seu negócio.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg">
              Frascos, potes, bisnagas e tampas para cosmético, farmacêutico e linha profissional.
              Compre a partir de 1 unidade.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/produtos"
                className="group inline-flex items-center gap-2 bg-brand-gradient px-7 py-3.5 rounded-full text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-elevated"
              >
                Ver catálogo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/sobre"
                className="inline-flex items-center px-7 py-3.5 rounded-full text-sm font-semibold border border-border bg-background hover:border-primary hover:text-primary"
              >
                Sobre a marca
              </Link>
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

      {/* Categories */}
      <section className="container py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Compre por segmento</h2>
          <p className="text-muted-foreground">Encontre a embalagem certa para o seu produto</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {navCats.map((cat) => {
            const Icon = categoryIcons[cat] || Sparkles;
            return (
              <Link
                key={cat}
                to="/produtos"
                className="group bg-secondary/50 hover:bg-accent border border-border rounded-xl p-6 text-center transition-all hover:shadow-card hover:-translate-y-1"
              >
                <div className="h-14 w-14 mx-auto mb-3 rounded-full bg-background flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground" strokeWidth={1.6} />
                </div>
                <h3 className="font-semibold text-sm">{cat}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="container py-12">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Lançamentos</h2>
            <p className="text-muted-foreground mt-1">Os produtos mais procurados da semana</p>
          </div>
          <Link
            to="/produtos"
            className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 group"
          >
            Ver todos <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="container py-16">
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
