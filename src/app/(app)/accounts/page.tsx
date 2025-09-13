'use client';

import { useEffect, useMemo, useState } from "react";
import { get } from "@/lib/api";
import type { AccountDTO } from "@/lib/types";
import AccountCard from "@/components/AccountCard";
import ActionBar from "@/components/ActionBar";
import TabBar from "@/components/TabBar";

export default function AccountsPage() {
  const [rows, setRows] = useState<AccountDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    get<AccountDTO[]>("accounts", { select: "id,name,type,currency,balance,is_shared,owner_user_id", order: "created_at.asc" })
      .then(setRows)
      .catch(e => setError(String(e)));
  }, []);

  // простая группировка по типу (наличка/карта/и т.д.)
  const grouped = useMemo(() => {
    const map = new Map<string, AccountDTO[]>();
    for (const a of rows) {
      const key = a.type || "Другое";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    return Array.from(map.entries());
  }, [rows]);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <main className="mx-auto max-w-5xl px-4 pb-24">
        <header className="pt-6 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Счета
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Быстрый доступ к балансам и добавлению операций
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-300 bg-rose-50 text-rose-700 p-3">
            Ошибка: {error}
          </div>
        )}

        {/* Заголовок-«шапка» как в твоём макете */}
        <div className="hidden md:grid grid-cols-12 items-center rounded-2xl border
                        border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-800/40 px-5 py-3 mb-3">
          <div className="col-span-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">type</div>
          <div className="col-span-5 text-center text-lg font-semibold text-zinc-800 dark:text-zinc-100">name</div>
          <div className="col-span-3 text-center text-lg font-semibold text-zinc-800 dark:text-zinc-100">balance</div>
          <div className="col-span-1 text-right text-sm font-medium text-zinc-600 dark:text-zinc-300">shared</div>
        </div>

        {/* Секции по типу */}
        <div className="space-y-6">
          {grouped.map(([type, items]) => (
            <section key={type} className="space-y-3">
              <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {type}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {items.map((a) => (
                  <AccountCard
                    key={a.id}
                    name={a.name}
                    type={type}
                    balance={a.balance}
                    currency={(a.currency ?? "").toUpperCase()}
                    isShared={a.is_shared}
                    onClick={() => {
                      // клик по карточке → фильтр по счёту (дальше сможем реализовать на /operations)
                      window.location.href = `/operations?account=${a.id}`;
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Быстрые действия */}
        <ActionBar />
      </main>

      <TabBar />
    </div>
  );
}
