import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
export type AppRole = Database["public"]["Enums"]["app_role"];

export type UsuarioSistema = Profile & {
  role: AppRole | null;
  status: "ativo" | "inativo";
};

export const listUsuarios = async () => {
  const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] =
    await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);

  if (profilesError) throw profilesError;
  if (rolesError) throw rolesError;

  const rolesByUser = new Map((roles ?? []).map((role) => [role.user_id, role.role]));

  return (profiles ?? []).map((profile) => ({
    ...profile,
    role: rolesByUser.get(profile.id) ?? null,
    status: "ativo" as const,
  })) satisfies UsuarioSistema[];
};
