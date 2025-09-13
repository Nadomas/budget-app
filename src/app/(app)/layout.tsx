'use client';

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";


export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    // первичная проверка
    supabase.auth.getSession().then(({ data }) => {
      const ok = !!data.session;
      setHasSession(ok);
      setLoading(false);
      if (!ok && path !== "/login") router.replace("/login");
    });

    // подписка на изменения сессии
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const ok = !!session;
      setHasSession(ok);
      if (!ok && path !== "/login") router.replace("/login");
      if (ok && path === "/login") router.replace("/");
    });

    return () => subscription.unsubscribe();
  }, [router, path]);

  if (loading) return null;

  return hasSession ? (
    <div className="min-h-dvh">
      <nav className="sticky top-0 bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto flex gap-4 p-3">
          <a href="/" className="px-3 py-2 rounded-lg hover:bg-gray-100">Мой бюджет</a>
          <a
            href="/login"
            className="ml-auto px-3 py-2 rounded-lg hover:bg-gray-100"
            onClick={async (e) => {
              e.preventDefault();
              await supabase.auth.signOut();
            }}
          >
            Выйти
          </a>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  ) : null;
}

