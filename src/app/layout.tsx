import type { Metadata } from "next";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "KVARON_X — KRX | Премиальная социальная сеть",
  description:
    "KVARON_X (KRX) — социальная сеть нового поколения. Лента, сообщения, истории, тренды.",
};

import { AuthProvider } from "@/context/AuthContext";
import CyberToast from "@/components/CyberToast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark h-full">
      <body
        className="h-full overflow-hidden font-sans antialiased"
      >
        <AuthProvider>
          <CyberToast />
          <AppProviders>{children}</AppProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
