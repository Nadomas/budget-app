'use client';

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";


export default function Home() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  return (
    <main className="min-h-dvh grid place-items-center bg-gray-100">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-blue-600">Мой бюджет — старт</h1>
        <p className="text-lg">Вы вошли как: <b>{email ?? "..."}</b></p>
      </div>
    </main>
  );
}


