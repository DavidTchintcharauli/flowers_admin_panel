"use server";

import { createClient } from "../../utils/supabase/server";

export async function addProduct(name: string, description: string, price: number, imageUrl: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return { error: "⛔ თქვენ არ ხართ ავტორიზებული." };
  }

  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (roleError || !roleData) {
    return { error: "⛔ თქვენ არ გაქვთ პროდუქტის დამატების უფლება." };
  }

  if (roleData.role !== "admin") {
    return { error: "⛔ მხოლოდ `admin`-ს შეუძლია პროდუქტის დამატება." };
  }

  const safeName = name.trim();
  const safeDescription = description.trim();
  const safePrice = parseFloat(price.toString());

  if (!safeName || !safeDescription || isNaN(safePrice) || safePrice <= 0) {
    return { error: "⛔ არასწორი მონაცემები. გთხოვთ შეავსოთ ყველა ველი სწორად." };
  }

  const { error } = await supabase.from("products").insert([
    {
      name: safeName,
      description: safeDescription,
      price: safePrice,
      image_url: imageUrl,
    },
  ]);

  if (error) {
    return { error: "⛔ პროდუქტის დამატება ვერ მოხერხდა: " + error.message };
  }

  return { success: "✅ პროდუქტი წარმატებით დაემატა!" };
}
