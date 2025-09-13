'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Счета" },
  { href: "/operations", label: "Операции" },
  { href: "/family", label: "Семья" },
  { href: "/settings", label: "Настройки" },
];

export default function TabBar() {
  const path = usePathname();

  return (
    <nav className="sticky bottom-0 inset-x-0 z-20 border-t border-zinc-200 dark:border-zinc-800
                    bg-white/90 dark:bg-zinc-900/80 backdrop-blur">
      <div className="mx-auto max-w-5xl grid grid-cols-4">
        {tabs.map(t => {
          const active = path === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`text-center py-3 text-sm font-medium
                         ${active
                           ? "text-zinc-900 dark:text-white bg-zinc-100/70 dark:bg-zinc-800/60"
                           : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"}`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
