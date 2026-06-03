"use client";

import Link from "next/link";
import { Gamepad2, Globe, Lock, Mail, RadioTower, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const providers = [
  { label: "Google", icon: Globe },
  { label: "Telegram", icon: Send },
  { label: "Discord", icon: Gamepad2 },
  { label: "X/Twitter", icon: RadioTower },
];

export function LoginForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Input
        name="login"
        label="Email or nickname"
        type="text"
        autoComplete="username"
        placeholder="nova@krx.app"
        leftIcon={<Mail className="h-4 w-4" />}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter password"
        leftIcon={<Lock className="h-4 w-4" />}
      />
      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href="/forgot-password" className="font-semibold text-neutral-300 hover:text-white">
          Forgot password
        </Link>
        <Link href="/register" className="font-semibold text-neutral-300 hover:text-white">
          Create account
        </Link>
      </div>
      <Button type="submit" className="w-full" size="lg">
        Login
      </Button>
      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider) => {
          const Icon = provider.icon;
          return (
            <Button
              key={provider.label}
              type="button"
              variant="secondary"
              leftIcon={<Icon className="h-4 w-4" />}
            >
              {provider.label}
            </Button>
          );
        })}
      </div>
    </form>
  );
}
