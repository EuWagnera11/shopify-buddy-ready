import { Layout } from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/format";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { FormEvent } from "react";

const Checkout = () => {
  const { items, total, clear } = useCart();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: integrate with Shopify checkout
    toast.success("Redirecionando para checkout Shopify...");
    setTimeout(() => clear(), 1500);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <section className="container py-32 text-center">
          <h1 className="font-display text-4xl mb-4">Carrinho vazio</h1>
          <p className="text-muted-foreground mb-8">Adicione produtos antes de finalizar.</p>
          <Link to="/produtos" className="inline-block bg-brand-gradient px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground">
            Explorar coleção
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container py-16 max-w-6xl">
        <h1 className="font-display text-4xl md:text-5xl mb-12">Checkout</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <h2 className="font-display text-2xl mb-6 pb-3 border-b border-border">Contato</h2>
              <input type="email" required placeholder="E-mail" className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-primary" />
            </div>

            <div>
              <h2 className="font-display text-2xl mb-6 pb-3 border-b border-border">Entrega</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <input required placeholder="Nome" className="bg-input border border-border px-4 py-3 focus:outline-none focus:border-primary" />
                <input required placeholder="Sobrenome" className="bg-input border border-border px-4 py-3 focus:outline-none focus:border-primary" />
                <input required placeholder="Endereço" className="md:col-span-2 bg-input border border-border px-4 py-3 focus:outline-none focus:border-primary" />
                <input required placeholder="Cidade" className="bg-input border border-border px-4 py-3 focus:outline-none focus:border-primary" />
                <input required placeholder="CEP" className="bg-input border border-border px-4 py-3 focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl mb-6 pb-3 border-b border-border">Pagamento</h2>
              <div className="bg-secondary/40 border border-border p-6 text-sm text-muted-foreground flex items-center gap-3">
                <Lock className="h-4 w-4 text-primary" />
                Pagamento processado via Shopify Checkout (integração pendente).
              </div>
            </div>

            <button className="w-full bg-brand-gradient text-primary-foreground py-5 uppercase tracking-[0.3em] text-xs font-semibold hover:opacity-90 transition-opacity shadow-elevated">
              Finalizar pedido · {formatBRL(total)}
            </button>
          </form>

          <aside className="bg-secondary/30 p-6 h-fit lg:sticky lg:top-28">
            <h2 className="font-display text-xl mb-6">Resumo</h2>
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
              {items.map((i) => (
                <div key={i.product.id} className="flex gap-3">
                  <div className="relative">
                    <img src={i.product.image} alt={i.product.title} className="h-16 w-14 object-cover bg-background" />
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-brand-gradient text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                      {i.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{i.product.title}</p>
                    <p className="text-xs text-muted-foreground">{i.product.capacity}</p>
                  </div>
                  <span className="text-sm text-primary">{formatBRL(i.product.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-border text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatBRL(total)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Frete</span><span>A calcular</span></div>
              <div className="flex justify-between pt-3 border-t border-border text-base">
                <span>Total</span>
                <span className="text-primary text-xl font-medium">{formatBRL(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
