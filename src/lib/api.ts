// src/lib/api.ts
export async function authHeaders(): Promise<HeadersInit> {
  const { supabase } = await import("./supabaseClient");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,       // anon key
    "Authorization": `Bearer ${token}`,                         // JWT пользователя
    "Content-Type": "application/json",
    "Prefer": "return=representation",
  };
}

const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function get<T>(path: string, params?: Record<string, string>) {
  const url = new URL(`${BASE}/rest/v1/${path}`);
  Object.entries(params ?? {}).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers: await authHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function post<T>(path: string, body: unknown) {
  const res = await fetch(`${BASE}/rest/v1/${path}`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
