import { Layout } from "@/components/Layout";
import hero from "@/assets/hero.jpg";

const About = () => (
  <Layout>
    <section className="container py-20 max-w-4xl">
      <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Estúdio Gold</p>
      <h1 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">
        Feito para marcas que <span className="text-gold-gradient">recusam o comum.</span>
      </h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-12">
        Há mais de uma década criamos embalagens douradas para perfumaria fina,
        cosméticos premium e edições limitadas. Cada peça é resultado do encontro
        entre design contemporâneo e tradição artesanal.
      </p>
      <img src={hero} alt="Estúdio" className="w-full aspect-[16/9] object-cover mb-12" loading="lazy" />
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { n: "12+", l: "Anos de mercado" },
          { n: "300+", l: "Marcas atendidas" },
          { n: "100%", l: "Controle de qualidade" },
        ].map((s) => (
          <div key={s.l} className="text-center md:text-left">
            <p className="font-serif text-5xl text-gold-gradient mb-2">{s.n}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default About;
