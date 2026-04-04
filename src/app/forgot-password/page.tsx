import type { Metadata } from "next";
import { ForgotPasswordForm } from "./form";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
          <p className="mt-2 text-sm text-muted">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
