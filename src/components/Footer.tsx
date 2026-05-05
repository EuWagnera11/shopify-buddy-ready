import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="mt-24 bg-secondary/40 border-t border-border">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div>
          <img src={logo} alt="Gold Embalagens" className="h-14 w-auto mb-4" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Embalagens plásticas e de vidro para os segmentos cosmético, farmacêutico e profissional.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">Categorias</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/produtos" className="hover:text-primary">Cosmético</Link></li>
            <li><Link to="/produtos" className="hover:text-primary">Farmacêutico</Link></li>
            <li><Link to="/produtos" className="hover:text-primary">Linha Profissional</Link></li>
            <li><Link to="/produtos" className="hover:text-primary">Sustentáveis</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">Atendimento</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> (11) 9 9999-9999</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contato@goldembalagens.com</li>
            <li>Seg–Sex · 9h às 18h</li>
            <li><Link to="/contato" className="hover:text-primary">Fale conosco</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Receba novidades e promoções.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button className="bg-brand-gradient px-4 py-2 rounded-md text-xs font-semibold text-primary-foreground hover:opacity-90">
              OK
            </button>
          </form>
          <div className="flex gap-3 mt-5">
            <a href="#" className="h-9 w-9 flex items-center justify-center rounded-md bg-background border border-border hover:border-primary hover:text-primary">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="h-9 w-9 flex items-center justify-center rounded-md bg-background border border-border hover:border-primary hover:text-primary">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 bg-background">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Gold Embalagens. Todos os direitos reservados.</p>
          <p>CNPJ 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
};
