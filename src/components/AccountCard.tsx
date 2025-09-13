'use client';

import { formatMoney } from "@/lib/format";

type Props = {
  name: string;
  type: string;
  balance: string | number;
  currency: string;
  isShared?: boolean;
  onClick?: () => void;
};

export default function AccountCard({
  name, type, balance, currency, isShared, onClick
}: Props) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl border bg-white/90 dark:bg-zinc-900/80
                 backdrop-blur shadow-sm hover:shadow-md transition-shadow
                 border-zinc-200 dark:border-zinc-800 p-4 md:p-5"
    >
      <div className="flex items-start gap-3">
        {/* Тип счёта */}
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          {type}
        </div>

        {/* флажок shared справа */}
        {isShared && (
          <div className="ml-auto">
            <span className="inline-block h-3 w-3 rounded-sm bg-yellow-400 align-middle ring-1 ring-yellow-500/40" />
            <span className="ml-2 text-xs text-zinc-500">общий</span>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <div className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {name}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {formatMoney(balance, (currency ?? "").toUpperCase())}
          </div>
          <div className="text-xs text-zinc-500">{currency?.toUpperCase()}</div>
        </div>
      </div>
    </button>
  );
}
