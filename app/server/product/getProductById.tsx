"use server";

import { createClient } from "../../utils/supabase/server";

export async function getProductById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  
    if (error) {
      console.error("პროდუქტის წამოღების შეცდომა:", error.message);
      return null;
    }
  
    return data;
  }