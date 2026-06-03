import type { ReactNode } from "react";
import { FadeIn } from "@/components/motion/fade-in";

type AuthShellProps = {
  title: string;
  eyebrow: string;
  children: ReactNode;
};

export function AuthShell({ title, eyebrow, children }: AuthShellProps) {
  return (
    <main className="krx-grid min-h-screen bg-black text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-12 lg:px-8">
        <FadeIn className="flex min-h-[34vh] flex-col justify-between border-b border-[#2a2a2a] pb-8 lg:min-h-[620px] lg:border-b-0 lg:border-r lg:py-10 lg:pr-12">
          <div>
            <p className="font-mono text-6xl font-black text-white sm:text-7xl">
              KRX
            </p>
            <p className="mt-4 font-mono text-sm font-semibold text-neutral-400">
              CONNECT. SHARE. DOMINATE.
            </p>
          </div>
          <div className="mt-12 max-w-xl">
            <p className="text-sm font-semibold uppercase text-neutral-500">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
              {title}
            </h1>
          </div>
        </FadeIn>
        <FadeIn className="py-8 lg:py-0">{children}</FadeIn>
      </div>
    </main>
  );
}
