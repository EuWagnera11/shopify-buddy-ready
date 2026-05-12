import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, Search, X, User, Heart } from "lucide-react";
import { useCartStore, useCartCount } from "@/stores/cartStore";
import { useWishlistCount } from "@/stores/wishlistStore";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Produtos" },
  { to: "/colecoes", label: "Coleções" },
  { to: "/favoritos", label: "Favoritos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

export const Header = () => {
  const setOpen = useCartStore((s) => s.setOpen);
  const count = useCartCount();
  const wishCount = useWishlistCount();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/produtos?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="bg-brand-gradient text-primary-foreground text-center text-xs py-2 px-4">
        Use o cupom <strong className="font-semibold">BEMVINDO10</strong> e ganhe 10% OFF na primeira compra · Frete grátis acima de R$ 299
      </div>

      <div className="container flex h-20 items-center gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Gold Embalagens" className="h-12 w-auto" />
        </Link>

        <form onSubmit={onSearch} className="flex-1 hidden md:flex">
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar frascos, potes, bisnagas…"
              className="w-full bg-secondary/60 border border-border rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-background transition-colors"
            />
          </div>
        </form>

        <div className="flex items-center gap-1">
          <Link
            to="/favoritos"
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors text-sm relative"
            aria-label="Favoritos"
          >
            <div className="relative">
              <Heart className="h-5 w-5 text-primary" />
              {wishCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {wishCount}
                </span>
              )}
            </div>
          </Link>
          <Link
            to="/conta"
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
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <form onSubmit={onSearch} className="container py-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar…"
                className="w-full bg-secondary/60 border border-border rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </form>
          <nav className="container flex flex-col pb-4">
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
