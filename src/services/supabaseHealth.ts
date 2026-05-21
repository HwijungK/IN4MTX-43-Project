import { isSupabaseConfigured, supabase } from "../lib/supabase";

export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message: "Supabase env vars are missing. Fill .env from .env.example."
    };
  }

  const { error } = await supabase.from("universities").select("id").limit(1);

  if (error) {
    return {
      ok: false,
      message: error.message
    };
  }

  return {
    ok: true,
    message: "Supabase connection succeeded."
  };
}
