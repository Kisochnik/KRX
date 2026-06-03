"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Input
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="nova@krx.app"
        leftIcon={<Mail className="h-4 w-4" />}
      />
      <Button type="submit" className="w-full" size="lg">
        Send code
      </Button>
      <p className="text-center text-sm text-neutral-400">
        Back to{" "}
        <Link href="/login" className="font-semibold text-white">
          Login
        </Link>
      </p>
    </form>
  );
}
