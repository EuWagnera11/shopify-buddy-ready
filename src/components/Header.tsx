import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, Search, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Cosmético" },
  { to: "/produtos", label: "Farmacêutico" },
  { to: "/produtos", label: "Linha Profissional" },
  { to: "/produtos", label: "Sustentáveis" },
];

export const Header = () => {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      {/* Top promo bar */}
      <div className="bg-brand-gradient text-primary-foreground text-center text-xs py-2 px-4">
        Use o cupom <strong className="font-semibold">BEMVINDO10</strong> e ganhe 10% OFF na primeira compra
      </div>

      {/* Main bar */}
      <div className="container flex h-20 items-center gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Gold Embalagens" className="h-12 w-auto" />
        </Link>

        <div className="flex-1 hidden md:flex">
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Olá, o que você procura?"
              className="w-full bg-secondary/60 border border-border rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-background transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/contato"
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors text-sm"
          >
            <User className="h-5 w-5 text-primary" />
            <span className="font-medium">Minha conta</span>
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Carrinho"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5 text-primary" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-sm font-medium">Carrinho</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Categories nav */}
      <nav className="hidden md:block border-t border-border">
        <div className="container flex items-center gap-8 h-12">
          {nav.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.to ? "text-primary" : "text-foreground/80"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/produtos" className="ml-auto text-sm font-semibold text-destructive hover:underline">
            Outlet
          </Link>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container flex flex-col py-4">
            {nav.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-foreground/80 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
