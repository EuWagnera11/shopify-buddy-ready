import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile({ full_name: data.full_name ?? "", phone: data.phone ?? "" });
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: profile.full_name, phone: profile.phone });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Perfil atualizado");
  };

  if (loading || !user) return null;

  return (
    <Layout>
      <section className="container py-20 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Minha conta</p>
        <h1 className="font-display text-4xl mb-2">Olá, {profile.full_name || user.email}</h1>
        <p className="text-muted-foreground mb-10">{user.email}</p>

        <div className="space-y-4 bg-secondary/30 p-8">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Nome completo</label>
            <input
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full bg-input border border-border px-4 py-3 mt-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Telefone</label>
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-input border border-border px-4 py-3 mt-2 focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="w-full bg-brand-gradient text-primary-foreground py-4 uppercase tracking-[0.25em] text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Salvar alterações
          </button>
        </div>

        <button
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
          className="mt-6 text-sm text-muted-foreground hover:text-primary"
        >
          Sair da conta
        </button>
      </section>
    </Layout>
  );
};

export default Account;
