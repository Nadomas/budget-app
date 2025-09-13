import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Приложение для бюджета",
  description: "MVP family budget app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
