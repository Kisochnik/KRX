"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyEmail } from "@/features/auth/auth.service";
import { verifyEmailSchema } from "@/features/auth/schemas";
import { useAuthStore } from "@/store/auth.store";

export function VerifyCodeForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: "", code: "" },
  });

  const onSubmit = async (values: { email: string; code: string }) => {
    try {
      const result = await verifyEmail(values.email, values.code);
      if (result.accessToken) {
        localStorage.setItem("krx:token", result.accessToken);
        setSession(result.accessToken, result.user);
        router.push("/");
      }
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "The verification code is invalid or expired.";
      setError("root", { message: message ?? "The verification code is invalid or expired." });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email")}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="nova@krx.app"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
      />
      <Input
        {...register("code")}
        name="code"
        label="6 digit code"
        inputMode="numeric"
        maxLength={6}
        placeholder="000000"
        leftIcon={<ShieldCheck className="h-4 w-4" />}
        error={errors.code?.message}
      />
      {errors.root?.message ? (
        <p className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">{errors.root.message}</p>
      ) : null}
      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
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
