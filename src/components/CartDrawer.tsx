import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore, useCartTotal } from "@/stores/cartStore";
import { formatBRL } from "@/lib/format";
import { Minus, Plus, Trash2, ShoppingBag, Loader2, ExternalLink } from "lucide-react";
import { useEffect } from "react";

export const CartDrawer = () => {
  const { items, isOpen, setOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart, isLoading, isSyncing } =
    useCartStore();
  const total = useCartTotal();

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  const currency = items[0]?.price.currencyCode || "BRL";
  const FREE_SHIPPING_THRESHOLD = 299;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-left">Seu carrinho</SheetTitle>
        </SheetHeader>

        {items.length > 0 && (
          <div className="bg-secondary/40 rounded-lg p-3 my-2 text-xs">
            {remaining > 0 ? (
              <p className="text-foreground/80">
                Faltam <span className="font-semibold text-primary">{formatBRL(remaining)}</span> para frete grátis 🚚
              </p>
            ) : (
              <p className="text-primary font-semibold">🎉 Você ganhou frete grátis!</p>
            )}
            <div className="mt-2 h-1.5 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-brand-gradient transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <button
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-[0.2em] text-primary hover:underline"
            >
              Explorar coleção
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-4">
              {items.map((item) => {
                const img = item.product.node.images.edges[0]?.node;
                return (
                  <div key={item.variantId} className="flex gap-4 pb-4 border-b border-border">
                    {img && (
                      <img
                        src={img.url}
                        alt={item.product.node.title}
                        className="h-24 w-20 object-cover bg-secondary rounded-md"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-base line-clamp-2">{item.product.node.title}</h4>
                      {item.variantTitle && item.variantTitle !== "Default Title" && (
                        <p className="text-xs text-muted-foreground mb-3">{item.variantTitle}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="h-7 w-7 flex items-center justify-center hover:bg-secondary"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="h-7 w-7 flex items-center justify-center hover:bg-secondary"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-primary font-medium">
                          {formatBRL(parseFloat(item.price.amount) * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-muted-foreground hover:text-destructive self-start"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between text-base">
                <span>Total</span>
                <span className="text-primary font-medium text-xl">{formatBRL(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Frete e impostos calculados no checkout. Moeda: {currency}.
              </p>
              <button
                onClick={handleCheckout}
                disabled={isLoading || isSyncing}
                className="w-full bg-brand-gradient text-primary-foreground text-center py-4 uppercase tracking-[0.25em] text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    Finalizar no Shopify
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
