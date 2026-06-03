"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Lock, Mail, Phone, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/features/auth/auth.service";
import { registerSchema } from "@/features/auth/schemas";

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { nickname: "", email: "", phone: "", password: "", birthDate: "" },
  });

  const onSubmit = async (values: {
    nickname: string;
    email: string;
    phone?: string;
    password: string;
    birthDate: string;
  }) => {
    try {
      await registerUser(values);
      router.push("/verify-code");
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Unable to create the account right now.";
      setError("root", { message: message ?? "Unable to create the account right now." });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("nickname")}
        name="nickname"
        label="Nickname"
        type="text"
        autoComplete="username"
        placeholder="nova"
        leftIcon={<UserRound className="h-4 w-4" />}
        error={errors.nickname?.message}
      />
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
        {...register("phone")}
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        placeholder="+1 555 0100"
        leftIcon={<Phone className="h-4 w-4" />}
        error={errors.phone?.message}
      />
      <Input
        {...register("password")}
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Create password"
        leftIcon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
      />
      <Input
        {...register("birthDate")}
        name="birthDate"
        label="Birth date"
        type="date"
        leftIcon={<Calendar className="h-4 w-4" />}
        error={errors.birthDate?.message}
      />
      {errors.root?.message ? (
        <p className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">{errors.root.message}</p>
      ) : null}
      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
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
