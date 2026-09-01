import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// When the env vars are missing (e.g. no local .env), don't let createClient
// throw at import time — that would crash the entire app, including pages that
// don't use Supabase. Instead export a stub that throws a clear error only if
// something actually tries to use it.
function makeMissingEnvStub() {
  const message =
    "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file.";
  console.warn(message);
  return new Proxy(
    {},
    {
      get() {
        throw new Error(message);
      },
    }
  );
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : makeMissingEnvStub();
