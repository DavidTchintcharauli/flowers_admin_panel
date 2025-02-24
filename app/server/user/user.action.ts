"use server";

import { createClient } from "../../utils/supabase/server";

export async function getUserRoleServer() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (!data?.user || error) return "guest";

  const { data: roleData } = await supabase
    .from("roles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  return roleData?.role ?? "user";
}
