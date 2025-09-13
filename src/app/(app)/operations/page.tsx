'use client';

import { useEffect, useState } from "react";
import { get } from "../../../lib/api";
import { formatMoney } from "../../../lib/format";

type OperationRow = {
  id: string;
  op_date: string;
  op_time: string | null;
  type: "income" | "expense" | "transfer";
  amount: string;
  currency: string;
  description: string | null;
  // embed по ИМЕНАМ FK:
  account: { name: string } | null;          // operations_account_id_fkey
  transfer_account: { name: string } | null; // operations_transfer_account_id_fkey
  category: { name: string } | null;
};

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString();

export default function OperationsPage() {
  const [rows, setRows] = useState<OperationRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    get<OperationRow[]>("operations", {
      select: [
        "id",
        "op_date",
        "op_time",
        "type",
        "amount",
        "currency",
        "description",
        // ключевой момент — указываем явные связи:
        "account:accounts!operations_account_id_fkey(name)",
        "transfer_account:accounts!operations_transfer_account_id_fkey(name)",
        "category:categories(name)"
      ].join(","),
      order: "op_date.desc,op_time.desc.nullsfirst",
      limit: "100",
    })
      .then(setRows)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <main className="p-6 text-red-600">Ошибка: {error}</main>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Операции</h1>

      <div className="overflow-auto rounded-xl border shadow-sm bg-white text-gray-900">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="text-left">
              <th className="p-2">Дата</th>
              <th className="p-2">Тип</th>
              <th className="p-2">Счёт</th>
              <th className="p-2">Категория</th>
              <th className="p-2">Сумма</th>
              <th className="p-2">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const acct =
                r.type === "transfer" && r.transfer_account?.name
                  ? `${r.account?.name ?? "—"} → ${r.transfer_account.name}`
                  : (r.account?.name ?? "—");

              return (
                <tr key={r.id} className={`border-t ${i % 2 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                  <td className="p-2 whitespace-nowrap">{fmtDate(r.op_date)}</td>
                  <td className="p-2">{r.type}</td>
                  <td className="p-2">{acct}</td>
                  <td className="p-2">{r.category?.name ?? "—"}</td>
                  <td className="p-2 font-medium">
                    {formatMoney(r.amount, (r.currency ?? "").toUpperCase())}
                  </td>
                  <td className="p-2">{r.description ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
