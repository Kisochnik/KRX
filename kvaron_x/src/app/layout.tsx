import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import CyberToast from "@/components/CyberToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "KVARON_X — Вход и Регистрация",
  description: "Премиальная футуристическая система авторизации KVARON_X в монохромном стиле с высокой степенью защиты.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cyber-black text-white">
        <AuthProvider>
          <CyberToast />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
