'use client';

import { FormEvent, useEffect, useMemo, useState } from "react";
import { get, post } from "../../../lib/api";

type Account = { id: string; name: string; currency: string };
type Category = { id: string; name: string; type: "income" | "expense" | "transfer" };

export default function AddOperationPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<any>({ type: "expense", currency: "USD", amount: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    get<Account[]>("accounts", { select: "id,name,currency", order: "created_at.asc" }).then((acs) => {
      setAccounts(acs);
      // если нет выбранного account_id — подставим первый доступный
      if (!form.account_id && acs.length) {
        setForm((f: any) => ({ ...f, account_id: acs[0].id, currency: acs[0].currency ?? f.currency }));
      }
    });
    get<Category[]>("categories", { select: "id,name,type" }).then(setCategories);
  }, []);

  const needCategory = form.type !== "transfer";
  const canSubmit = useMemo(() => {
    if (!form.account_id) return false;
    if (!form.amount || isNaN(Number(form.amount))) return false;
    if (!form.currency) return false;
    if (needCategory && !form.category_id) return false;
    if (form.type === "transfer" && !form.transfer_account_id) return false;
    return true;
  }, [form, needCategory]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(null); setErr(null);

    if (!canSubmit) {
      setErr("Заполните обязательные поля: счёт, сумма, валюта, категория/счёт-получатель.");
      return;
    }

    try {
      await post("operations", {
        type: form.type,
        account_id: form.account_id,
        category_id: needCategory ? (form.category_id ?? null) : null,
        transfer_account_id: form.type === "transfer" ? form.transfer_account_id : null,
        amount: Number(form.amount),
        currency: String(form.currency).toUpperCase(),
        description: form.description ?? null,
        op_date: new Date().toISOString().slice(0,10),
      });
      setMsg("Операция добавлена");
      setForm((f: any) => ({
        type: f.type,
        account_id: f.account_id,               // оставим выбранный счёт
        currency: f.currency,                   // и валюту
        amount: "",
        category_id: needCategory ? null : undefined,
        transfer_account_id: form.type === "transfer" ? null : undefined,
        description: ""
      }));
    } catch (e: any) {
      setErr(String(e));
    }
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Добавить операцию</h1>

      <form onSubmit={submit} className="grid md:grid-cols-6 gap-3 items-end">
        <select className="border rounded-lg p-2" value={form.type}
                onChange={e=>setForm({...form, type:e.target.value})}>
          <option value="expense">Расход</option>
          <option value="income">Доход</option>
          <option value="transfer">Перевод</option>
        </select>

        <select className="border rounded-lg p-2" value={form.account_id ?? ""}
                onChange={e=>setForm({...form, account_id:e.target.value})}>
          <option value="">Счёт</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        {form.type === "transfer" ? (
          <select className="border rounded-lg p-2" value={form.transfer_account_id ?? ""}
                  onChange={e=>setForm({...form, transfer_account_id:e.target.value})}>
            <option value="">→ Счёт</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        ) : (
          <select className="border rounded-lg p-2" value={form.category_id ?? ""}
                  onChange={e=>setForm({...form, category_id:e.target.value})}>
            <option value="">Категория</option>
            {categories.filter(c=>c.type!=="transfer").map(c =>
              <option key={c.id} value={c.id}>{c.name}</option>
            )}
          </select>
        )}

        <input className="border rounded-lg p-2" placeholder="Сумма" inputMode="decimal"
               value={form.amount ?? ""} onChange={e=>setForm({...form, amount:e.target.value})} />

        <input className="border rounded-lg p-2" placeholder="Валюта"
               value={form.currency ?? ""} onChange={e=>setForm({...form, currency:e.target.value})} />

        <button disabled={!canSubmit}
                className={`rounded-lg p-2 text-white ${canSubmit ? "bg-black" : "bg-gray-400 cursor-not-allowed"}`}>
          Добавить
        </button>
      </form>

      {msg && <div className="text-green-700">{msg}</div>}
      {err && <div className="text-red-600">Ошибка: {err}</div>}
    </main>
  );
}

