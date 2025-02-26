"use server";

import { createClient } from "../../utils/supabase/server";

export async function updateProduct(id: string, updates: { name: string; description: string; price: number; image_url: string }) {
    const supabase = await createClient();
    const { error } = await supabase.from("products").update(updates).eq("id", id);

    if (error) {
        console.error("პროდუქტის განახლების შეცდომა:", error.message);
        return { error: error.message };
    }

    return { success: "✅ პროდუქტი წარმატებით განახლდა!" };
}