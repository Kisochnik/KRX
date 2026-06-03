import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyCodeForm } from "@/components/auth/verify-code-form";

export const metadata: Metadata = {
  title: "Verify Code",
};

export default function VerifyCodePage() {
  return (
    <AuthShell title="Confirm the code." eyebrow="Verification">
      <VerifyCodeForm />
    </AuthShell>
  );
}
