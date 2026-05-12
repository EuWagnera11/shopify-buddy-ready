import { Layout } from "@/components/Layout";
import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Mínimo 6 caracteres");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Senha atualizada");
      navigate("/conta");
    }
  };

  return (
    <Layout>
      <section className="container py-20 max-w-md">
        <h1 className="font-display text-4xl mb-8">Nova senha</h1>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nova senha"
            className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-primary"
          />
          <button
            disabled={busy}
            className="w-full bg-brand-gradient text-primary-foreground py-4 uppercase tracking-[0.25em] text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Atualizar senha
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default ResetPassword;
