"use server";

import { createClient } from "../../utils/supabase/server";

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("პროდუქტის წაშლის შეცდომა:", error.message);
    return { error: "პროდუქტის წაშლის შეცდომა: " + error.message };
  }

  return { success: "✅ პროდუქტი წარმატებით წაიშალა!" };
}
