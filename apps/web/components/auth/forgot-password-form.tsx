"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword, resetPassword } from "@/features/auth/auth.service";
import { forgotPasswordSchema, resetPasswordSchema } from "@/features/auth/schemas";

export function ForgotPasswordForm() {
  const [status, setStatus] = useState("");

  const sendCodeForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "", code: "", newPassword: "", confirmPassword: "" },
  });

  const handleSendCode = async ({ email }: { email: string }) => {
    try {
      await forgotPassword(email);
      setStatus("A 6-digit reset code was generated. Use it below to set a new password.");
    } catch {
      setStatus("We could not send the reset code right now.");
    }
  };

  const handleResetPassword = async (values: {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await resetPassword(values.email, values.code, values.newPassword);
      setStatus("Password has been reset successfully. You can sign in now.");
    } catch {
      setStatus("The code is invalid or expired. Request a new one first.");
    }
  };

  return (
    <div className="space-y-6">
      <form className="space-y-5" onSubmit={sendCodeForm.handleSubmit(handleSendCode)}>
        <Input
          {...sendCodeForm.register("email")}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="nova@krx.app"
          leftIcon={<Mail className="h-4 w-4" />}
          error={sendCodeForm.formState.errors.email?.message}
        />
        <Button type="submit" className="w-full" size="lg" isLoading={sendCodeForm.formState.isSubmitting}>
          Send code
        </Button>
      </form>

      <form className="space-y-5" onSubmit={resetForm.handleSubmit(handleResetPassword)}>
        <Input
          {...resetForm.register("email")}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="nova@krx.app"
          leftIcon={<Mail className="h-4 w-4" />}
          error={resetForm.formState.errors.email?.message}
        />
        <Input
          {...resetForm.register("code")}
          name="code"
          label="6-digit code"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          leftIcon={<ShieldCheck className="h-4 w-4" />}
          error={resetForm.formState.errors.code?.message}
        />
        <Input
          {...resetForm.register("newPassword")}
          name="newPassword"
          label="New password"
          type="password"
          placeholder="New password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={resetForm.formState.errors.newPassword?.message}
        />
        <Input
          {...resetForm.register("confirmPassword")}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Repeat password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={resetForm.formState.errors.confirmPassword?.message}
        />
        <Button type="submit" className="w-full" size="lg" isLoading={resetForm.formState.isSubmitting}>
          Reset password
        </Button>
      </form>
      {status ? <p className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">{status}</p> : null}
      <p className="text-center text-sm text-neutral-400">
        Back to{" "}
        <Link href="/login" className="font-semibold text-white">
          Login
        </Link>
      </p>
    </div>
  );
}
