"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/features/auth/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    router.push("/feed");
  };

  return (
    <AuthLayout>
      <div className="scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-4 shadow-lg">
            <span className="text-black font-black text-lg" style={{ fontFamily: "Space Grotesk, system-ui" }}>KRX</span>
          </div>
          <h1 className="font-black text-2xl krx-logo-text" style={{ fontFamily: "Space Grotesk, system-ui" }}>KVARON_X</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-6 space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Email or handle
              </label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                className="krx-input" type="text" placeholder="you@kvaron.x or @handle" required />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <input value={password} onChange={e => setPassword(e.target.value)}
                  className="krx-input pr-10" type={showPass ? "text" : "password"} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPass
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link href="#" className="text-xs hover:underline" style={{ color: "var(--krx-blue)" }}>Forgot password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* Social logins */}
          <div className="grid grid-cols-2 gap-2">
            {[["Google","M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.93 4.9 1.93l1.9-2C18.22 3.09 15.75 2 12.2 2 6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"],
               ["Discord","M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"]
            ].map(([name, path]) => (
              <button key={name} className="btn-ghost rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={path}/></svg>
                {name}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: "var(--text-muted)" }}>
          No account yet?{" "}
          <Link href="/auth/register" className="font-semibold hover:underline" style={{ color: "var(--text-primary)" }}>
            Join KRX
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
