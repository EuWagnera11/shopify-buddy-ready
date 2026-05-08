import { Layout } from "@/components/Layout";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { FormEvent } from "react";

const Contact = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada! Retornaremos em breve.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <section className="container py-20 grid md:grid-cols-2 gap-16 max-w-6xl">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Fale conosco</p>
          <h1 className="font-display text-5xl mb-6">Vamos conversar.</h1>
          <p className="text-muted-foreground mb-10">
            Atendimento personalizado para projetos sob medida, pedidos em volume
            e orçamentos exclusivos.
          </p>
          <ul className="space-y-5 text-sm">
            <li className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-primary" />
              <span>(11) 91629-2626</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-primary" />
              <span>contato@goldembalagens.com</span>
            </li>
            <li className="flex items-center gap-4">
              <MapPin className="h-5 w-5 text-primary" />
              <span>São Paulo · SP · Brasil</span>
            </li>
          </ul>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-secondary/30 p-8">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Nome</label>
            <input required className="w-full bg-input border border-border px-4 py-3 mt-2 focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">E-mail</label>
            <input type="email" required className="w-full bg-input border border-border px-4 py-3 mt-2 focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Mensagem</label>
            <textarea required rows={5} className="w-full bg-input border border-border px-4 py-3 mt-2 focus:outline-none focus:border-primary resize-none" />
          </div>
          <button className="w-full bg-brand-gradient text-primary-foreground py-4 uppercase tracking-[0.25em] text-xs font-semibold hover:opacity-90 transition-opacity">
            Enviar mensagem
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default Contact;
