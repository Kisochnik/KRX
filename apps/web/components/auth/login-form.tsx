"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gamepad2, Globe, Lock, Mail, RadioTower, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/features/auth/auth.service";
import { loginSchema } from "@/features/auth/schemas";
import { useAuthStore } from "@/store/auth.store";

const providers = [
  { label: "Google", icon: Globe },
  { label: "Telegram", icon: Send },
  { label: "Discord", icon: Gamepad2 },
  { label: "X/Twitter", icon: RadioTower },
];

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "" },
  });

  const onSubmit = async (values: { login: string; password: string }) => {
    try {
      const result = await loginUser(values);
      if (result.accessToken) {
        localStorage.setItem("krx:token", result.accessToken);
        setSession(result.accessToken, result.user);
        router.push("/");
      }
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Unable to sign in right now.";
      setError("root", { message: message ?? "Unable to sign in right now." });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("login")}
        name="login"
        label="Email or nickname"
        type="text"
        autoComplete="username"
        placeholder="nova@krx.app"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.login?.message}
      />
      <Input
        {...register("password")}
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter password"
        leftIcon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
      />
      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href="/forgot-password" className="font-semibold text-neutral-300 hover:text-white">
          Forgot password
        </Link>
        <Link href="/register" className="font-semibold text-neutral-300 hover:text-white">
          Create account
        </Link>
      </div>
      {errors.root?.message ? (
        <p className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">{errors.root.message}</p>
      ) : null}
      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
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
