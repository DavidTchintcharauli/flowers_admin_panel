"use server";

import { createClient } from "../../utils/supabase/server";

export async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, image_url")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("🛑 პროდუქტების წამოღების შეცდომა:", error.message);
    return [];
  }

  return data.map((product) => ({
    ...product,
    image_url: product.image_url?.startsWith("http")
      ? product.image_url
      : "/fallback.jpg",
  }));
}
