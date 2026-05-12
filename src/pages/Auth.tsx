import { Layout } from "@/components/Layout";
import { useState, FormEvent, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(1, "Informe sua senha").max(72),
});

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  useEffect(() => {
    if (!loading && user) navigate("/conta", { replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/conta`,
            data: { full_name: parsed.data.fullName },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      } else {
        const parsed = loginSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate("/conta");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/conta`,
    });
    if (result.error) {
      toast.error("Erro ao entrar com Google");
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!form.email) return toast.error("Informe seu e-mail primeiro");
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("E-mail de recuperação enviado");
  };

  return (
    <Layout>
      <section className="container py-20 max-w-md">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Minha conta</p>
        <h1 className="font-display text-4xl mb-8">{mode === "login" ? "Entrar" : "Criar conta"}</h1>

        <button
          onClick={handleGoogle}
          disabled={busy}
          type="button"
          className="w-full border border-border bg-background py-3 mb-6 text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
        >
          Continuar com Google
        </button>

        <div className="flex items-center gap-3 mb-6 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          ou
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Nome completo</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-input border border-border px-4 py-3 mt-2 focus:outline-none focus:border-primary"
              />
            </div>
          )}
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-input border border-border px-4 py-3 mt-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Senha</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-input border border-border px-4 py-3 mt-2 focus:outline-none focus:border-primary"
            />
          </div>
          <button
            disabled={busy}
            className="w-full bg-brand-gradient text-primary-foreground py-4 uppercase tracking-[0.25em] text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary hover:underline">
            {mode === "login" ? "Criar conta" : "Já tenho conta"}
          </button>
          {mode === "login" && (
            <button onClick={handleReset} className="text-muted-foreground hover:text-primary">
              Esqueci a senha
            </button>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
