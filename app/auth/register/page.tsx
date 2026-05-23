"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/features/auth/AuthLayout";

const STEPS = ["Account","Profile","Done"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [handle,   setHandle]   = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 2) { setStep(s => s + 1); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setStep(2);
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="scale-in">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white mb-3">
            <span className="text-black font-black text-base" style={{ fontFamily: "Space Grotesk, system-ui" }}>KRX</span>
          </div>
          <h1 className="font-black text-xl krx-logo-text" style={{ fontFamily: "Space Grotesk, system-ui" }}>Join KVARON_X</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-5 px-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                     style={i <= step ? { background: "var(--krx-blue)", color: "#fff" } : { background: "var(--border)", color: "var(--text-muted)" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block"
                      style={{ color: i === step ? "var(--text-primary)" : "var(--text-muted)" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 h-px" style={{ background: i < step ? "var(--krx-blue)" : "var(--border)" }} />}
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-6">
          {step === 2 ? (
            /* Done step */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(34,197,94,0.15)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <h2 className="font-black text-lg" style={{ fontFamily: "Space Grotesk, system-ui" }}>Welcome, {username || "Kvaronian"}!</h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Your KRX account is ready.</p>
              </div>
              <button onClick={() => router.push("/feed")} className="btn-primary w-full rounded-xl py-2.5 text-sm font-bold">
                Enter KVARON_X →
              </button>
            </div>
          ) : (
            <form onSubmit={handleNext} className="space-y-4">
              {step === 0 && (
                <>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)}
                      className="krx-input" type="email" placeholder="you@kvaron.x" required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-secondary)" }}>Handle</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>@</span>
                      <input value={handle} onChange={e => setHandle(e.target.value.replace(/\s/g,""))}
                        className="krx-input pl-7" type="text" placeholder="your_handle" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)}
                      className="krx-input" type="password" placeholder="Min 8 characters" minLength={8} required />
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-secondary)" }}>Display Name</label>
                    <input value={username} onChange={e => setUsername(e.target.value)}
                      className="krx-input" type="text" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-secondary)" }}>Bio <span style={{ color: "var(--text-muted)" }}>(optional)</span></label>
                    <textarea className="krx-input resize-none" rows={3} placeholder="Tell the KRX network who you are..." />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-secondary)" }}>Website <span style={{ color: "var(--text-muted)" }}>(optional)</span></label>
                    <input className="krx-input" type="url" placeholder="https://yoursite.com" />
                  </div>
                </>
              )}

              <button type="submit" disabled={loading}
                className="btn-primary w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2">
                {loading ? (
                  <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Creating...</>
                ) : step === 0 ? "Continue →" : "Create Account"}
              </button>
            </form>
          )}
        </div>

        {step !== 2 && (
          <p className="text-center text-sm mt-4" style={{ color: "var(--text-muted)" }}>
            Already on KRX?{" "}
            <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: "var(--text-primary)" }}>Sign in</Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}
