import { Layout } from "@/components/Layout";
import hero from "@/assets/hero.jpg";
import { Leaf, Shield, Truck, Users } from "lucide-react";

const About = () => (
  <Layout>
    <section className="bg-soft-gradient py-16">
      <div className="container max-w-4xl">
        <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">Sobre nós</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Embalagens para todos os segmentos do seu negócio.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Há mais de uma década oferecemos embalagens plásticas e de vidro para indústrias dos
          segmentos cosmético, farmacêutico, alimentício e profissional. Nosso compromisso é
          entregar qualidade, agilidade e o melhor custo-benefício do mercado.
        </p>
      </div>
    </section>

    <section className="container py-16">
      <img src={hero} alt="Estúdio Gold Embalagens" className="w-full aspect-[16/9] object-cover rounded-2xl mb-12" loading="lazy" />

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { icon: Users, n: "300+", l: "Clientes ativos" },
          { icon: Truck, n: "12+", l: "Anos no mercado" },
          { icon: Shield, n: "100%", l: "Controle de qualidade" },
          { icon: Leaf, n: "Eco", l: "Linha sustentável" },
        ].map((s) => (
          <div key={s.l} className="bg-secondary/40 border border-border rounded-xl p-6 text-center">
            <s.icon className="h-8 w-8 text-primary mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-display text-3xl font-bold text-foreground mb-1">{s.n}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default About;
