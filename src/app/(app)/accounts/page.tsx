'use client';

import { useEffect, useState } from "react";
import { get } from "../../../lib/api";
import type { AccountDTO } from "../../../lib/types";
import { formatMoney } from "../../../lib/format";

export default function AccountsPage() {
  const [rows, setRows] = useState<AccountDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    get<AccountDTO[]>("accounts", { select: "*", order: "created_at.desc" })
      .then(setRows)
      .catch(e => setError(String(e)));
  }, []);

  if (error) return <main className="p-6 text-red-600">Ошибка: {error}</main>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Счета</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {rows.map(a => (
          <div key={a.id} className="rounded-xl border p-4">
            <div className="text-sm opacity-70">{a.type} · {a.currency}</div>
            <div className="text-xl font-semibold">{a.name}</div>
            <div className="text-2xl mt-2">
              {formatMoney(a.balance, a.currency)}
            </div>
            {a.is_shared && <div className="text-xs mt-1">Общий счёт</div>}
          </div>
        ))}
      </div>
    </main>
  );
}
