import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="mt-32 border-t border-border bg-secondary/30">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src={logo} alt="Gold Embalagens" className="h-16 w-auto mb-4" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Embalagens douradas premium para perfumaria, cosméticos e linhas de luxo.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Navegar</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
            <li><Link to="/produtos" className="hover:text-primary transition-colors">Coleção</Link></li>
            <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre nós</Link></li>
            <li><Link to="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Atendimento</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> (11) 9 9999-9999</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contato@goldembalagens.com</li>
            <li>Seg–Sex · 9h às 18h</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Receba lançamentos e ofertas exclusivas.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 bg-input border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button className="bg-gold-gradient px-4 py-2 rounded-sm text-xs uppercase tracking-widest text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Ir
            </button>
          </form>
          <div className="flex gap-3 mt-6">
            <a href="#" className="h-9 w-9 flex items-center justify-center rounded-sm border border-border hover:border-primary hover:text-primary transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="h-9 w-9 flex items-center justify-center rounded-sm border border-border hover:border-primary hover:text-primary transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Gold Embalagens. Todos os direitos reservados.</p>
          <p>CNPJ 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
};
