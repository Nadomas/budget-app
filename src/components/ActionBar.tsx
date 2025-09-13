'use client';

import { useRouter } from "next/navigation";

function CircleButton({
  label, color, onClick,
}: { label: string; color: "green" | "red"; onClick: () => void }) {
  const colorMap = {
    green: "bg-emerald-600 hover:bg-emerald-700",
    red: "bg-rose-600 hover:bg-rose-700",
  } as const;

  return (
    <button
      onClick={onClick}
      className={`h-16 w-16 md:h-20 md:w-20 rounded-full ${colorMap[color]} text-white
                  shadow-md active:translate-y-0.5 transition-transform`}
      aria-label={label}
      title={label}
    >
      <span className="text-xs md:text-sm font-semibold">{label}</span>
    </button>
  );
}

function RectButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-12 md:h-14
                 shadow-md active:translate-y-0.5 transition-transform text-sm md:text-base font-semibold"
    >
      {label}
    </button>
  );
}

export default function ActionBar() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center gap-6 md:gap-10 py-6">
      <CircleButton label="Доход" color="green" onClick={() => router.push("/add-operation?type=income")} />
      <RectButton label="перевод" onClick={() => router.push("/add-operation?type=transfer")} />
      <CircleButton label="Расход" color="red" onClick={() => router.push("/add-operation?type=expense")} />
    </div>
  );
}
