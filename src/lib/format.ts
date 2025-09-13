export function formatMoney(amount: string | number, currency: string) {
  const n = typeof amount === "string" ? Number(amount) : amount;
  const map: Record<string,string> = { "ПМР": "RUB", "PMR":"RUB" };
  const iso = map[currency] ?? currency.toUpperCase();
  // Валидный ISO4217? (латиница, 3 буквы)
  const isIso = /^[A-Z]{3}$/.test(currency);

  if (isIso) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
    } catch {
      // на всякий случай fallback, если движок не знает такой код
    }
  }

  // Fallback для кастомных/локальных кодов (например, "ПМР")
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n)} ${currency}`;
}

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString();

