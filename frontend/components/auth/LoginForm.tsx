"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

type LoginFormProps = {
  mode?: "login" | "signup";
};

export function LoginForm({ mode = "login" }: LoginFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailLooksValid) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Your password must contain at least 8 characters.",
      });
      return;
    }

    // Valid form → open ClipForge dashboard
    router.push("/dashboard");
  }

  return (
    <section
      className="w-full rounded-[20px] border border-[#efeaf8] bg-white p-5 shadow-[0_20px_50px_rgba(74,37,128,0.1)] sm:rounded-[22px] sm:p-7 md:p-8"
      aria-labelledby="form-title"
    >
      <h2
        id="form-title"
        className="font-display text-[1.4rem] font-extrabold tracking-tight text-[#171126] sm:text-[1.65rem]"
      >
        {isSignup ? "Create account" : "Sign in"}
      </h2>
      <p className="mt-1.5 font-sans text-[13px] text-[#777184]">
        {isSignup
          ? "Enter your details to get started."
          : "Enter your details to continue."}
      </p>

      <button
        type="button"
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-[#e8e1f1] bg-white font-sans text-[13px] font-semibold text-[#30283d] transition hover:bg-[#faf8ff]"
        onClick={() =>
          setMessage({
            type: "success",
            text: "Connect this button to Google OAuth when ready.",
          })
        }
      >
        <GoogleGlyph className="h-4 w-4" />
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 font-sans text-[11px] text-[#a39aaa]">
        <span className="h-px flex-1 bg-[#eee8f5]" />
        or
        <span className="h-px flex-1 bg-[#eee8f5]" />
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block font-sans text-[12px] font-semibold text-[#30283d]"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className={inputClass}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label
              htmlFor="password"
              className="font-sans text-[12px] font-semibold text-[#30283d]"
            >
              Password
            </label>
            {!isSignup ? (
              <Link
                href="#forgot-password"
                className="font-sans text-[12px] font-semibold text-[#4f46e5] hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setMessage({
                    type: "success",
                    text: "Connect this link to your password recovery page.",
                  });
                }}
              >
                Forgot password?
              </Link>
            ) : null}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            minLength={8}
            className={inputClass}
          />
        </div>

        {message ? (
          <p
            role="status"
            className={cn(
              "rounded-[10px] border px-3 py-2.5 font-sans text-xs leading-relaxed",
              message.type === "error"
                ? "border-[#ffd8e1] bg-[#fff0f3] text-[#9d2945]"
                : "border-[#c8f4db] bg-[#edfff5] text-[#246c4b]",
            )}
          >
            {message.text}
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#4f46e5] font-sans text-[14px] font-bold text-white shadow-[0_12px_28px_rgba(124,58,237,0.28)] transition hover:-translate-y-px hover:shadow-[0_14px_32px_rgba(124,58,237,0.34)]"
        >
          {isSignup ? "Get Started" : "Log In"}
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden />
        </button>
      </form>

      <p className="mt-5 text-center font-sans text-[13px] text-[#777184]">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#4f46e5] hover:underline">
              Log In
            </Link>
          </>
        ) : (
          <>
            New to ClipForge?{" "}
            <Link href="/signup" className="font-semibold text-[#4f46e5] hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </section>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-[#e8e1f1] bg-white px-3.5 font-sans text-[13px] text-[#171126] outline-none transition placeholder:text-[#aaa2b5] focus:border-[#a66aff] focus:shadow-[0_0_0_4px_rgba(139,61,255,0.10)]";
