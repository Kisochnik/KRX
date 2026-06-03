"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VerifyCodeForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Input
        name="code"
        label="6 digit code"
        inputMode="numeric"
        maxLength={6}
        placeholder="000000"
        leftIcon={<ShieldCheck className="h-4 w-4" />}
      />
      <Button type="submit" className="w-full" size="lg">
        Verify
      </Button>
      <p className="text-center text-sm text-neutral-400">
        Need a new code?{" "}
        <Link href="/forgot-password" className="font-semibold text-white">
          Resend
        </Link>
      </p>
    </form>
  );
}
