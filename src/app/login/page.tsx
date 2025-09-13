'use client';

import { supabase } from "../../lib/supabaseClient";


export default function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }, // можно добавить позже
    });
  };

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="max-w-sm w-full space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Войти в бюджет</h1>
        <button
          onClick={signInWithGoogle}
          className="w-full rounded-lg bg-black text-white py-2"
        >
          Войти через Google
        </button>
      </div>
    </main>
  );
}
