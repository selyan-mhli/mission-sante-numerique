import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base documentaire | Santé numérique",
  description: "Plateforme de structuration et exploitation documentaire en santé numérique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-700">
        {children}
      </body>
    </html>
  );
}
