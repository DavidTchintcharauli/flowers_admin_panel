"use server";

import { createClient } from "../../../utils/supabase/server";

export async function getUserRoleServer() {
  const supabase = createClient();

  const { data: user, error } = await (await supabase).auth.getUser();
  if (!user || error) return "guest";

  const { data: roleData } = await (await supabase)
    .from("roles")
    .select("role")
    .eq("id", user.user.id)
    .single();

  return roleData?.role ?? "user";
}
