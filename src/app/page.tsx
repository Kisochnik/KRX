"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HomePage } from "@/views/home/HomePage";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("kvaron_session") || sessionStorage.getItem("kvaron_session");
    if (!session && !user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black font-mono text-white gap-3 select-none">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
        <span className="text-[10px] uppercase tracking-widest text-white/30 animate-pulse">
          Проверка ключей доступа сессии...
        </span>
      </div>
    );
  }

  return <HomePage />;
}
