"use client";

import Link from "next/link";
import { Calendar, Lock, Mail, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Input
        name="nickname"
        label="Nickname"
        type="text"
        autoComplete="username"
        placeholder="nova"
        leftIcon={<UserRound className="h-4 w-4" />}
      />
      <Input
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="nova@krx.app"
        leftIcon={<Mail className="h-4 w-4" />}
      />
      <Input
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        placeholder="+1 555 0100"
        leftIcon={<Phone className="h-4 w-4" />}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Create password"
        leftIcon={<Lock className="h-4 w-4" />}
      />
      <Input
        name="birthDate"
        label="Birth date"
        type="date"
        leftIcon={<Calendar className="h-4 w-4" />}
      />
      <Button type="submit" className="w-full" size="lg">
        Register
      </Button>
      <p className="text-center text-sm text-neutral-400">
        Already in KRX?{" "}
        <Link href="/login" className="font-semibold text-white">
          Login
        </Link>
      </p>
    </form>
  );
}
