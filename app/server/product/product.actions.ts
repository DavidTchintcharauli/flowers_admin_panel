"use server";

import { createClient } from "../../utils/supabase/server";

export async function addProductAction(name: string, description: string, price: number, imageUrl: string) {
  const supabase = await createClient();

  const { data, error: userError } = await supabase.auth.getUser();
  if (!data?.user || userError) {
    return { error: "თქვენ არ ხართ ავტორიზებული." };
  }

  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (roleError || !roleData) {
    return { error: "თქვენ არ გაქვთ პროდუქტის დამატების უფლება." };
  }

  if (roleData.role !== "admin") {
    return { error: "მხოლოდ `admin`-ს შეუძლია პროდუქტის დამატება." };
  }

  const { error } = await supabase.from("products").insert([
    {
      name,
      description,
      price,
      image_url: imageUrl,
    },
  ]);

  if (error) {
    return { error: "პროდუქტის დამატება ვერ მოხერხდა: " + error.message };
  }

  return { success: "✅ პროდუქტი წარმატებით დაემატა!" };
}
