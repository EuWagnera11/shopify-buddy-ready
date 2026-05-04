import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/format";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export const CartDrawer = () => {
  const { items, isOpen, setOpen, updateQty, removeItem, total } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-left">Seu carrinho</SheetTitle>
        </SheetHeader>

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
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 pb-4 border-b border-border">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="h-24 w-20 object-cover bg-secondary"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-base truncate">{item.product.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{item.product.capacity}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQty(item.product.id, item.quantity - 1)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-secondary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.quantity + 1)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-secondary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-primary font-medium">
                        {formatBRL(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-muted-foreground hover:text-destructive self-start"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatBRL(total)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Total</span>
                <span className="text-primary font-medium text-xl">{formatBRL(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Frete calculado no checkout.</p>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="block w-full bg-brand-gradient text-primary-foreground text-center py-4 uppercase tracking-[0.25em] text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Finalizar compra
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
