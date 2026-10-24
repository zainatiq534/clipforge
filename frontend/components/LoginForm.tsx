"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
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
    const address = String(data.get("address") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneDigits = phone.replace(/\D/g, "");

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
    if (!address) {
      setMessage({ type: "error", text: "Please enter your address." });
      return;
    }
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setMessage({ type: "error", text: "Please enter a valid phone number." });
      return;
    }

    setMessage({
      type: "success",
      text: "Form looks good. Connect this page to your authentication backend to sign in.",
    });
  }

  return (
    <section
      className="w-full self-center rounded-[28px] border border-white/95 bg-white/88 p-7 shadow-[0_24px_70px_rgba(74,37,128,0.12)] backdrop-blur-md sm:p-9"
      aria-labelledby="form-title"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2
          id="form-title"
          className="font-display text-[1.7rem] font-extrabold tracking-tight text-[#171126] sm:text-[1.7rem]"
        >
          Sign in
        </h2>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#f4eaff] px-2.5 py-1.5 font-sans text-[10px] font-extrabold tracking-wide text-[#7e36df] uppercase">
          <Sparkles className="h-3 w-3" strokeWidth={2.2} aria-hidden />
          Secure Access
        </span>
      </div>

      <p className="mb-6 font-sans text-[13px] leading-relaxed text-[#777184]">
        Enter your details below to access your account.
      </p>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Email address" htmlFor="email">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9a8eaa]" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9a8eaa]" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            minLength={8}
            className={cn(inputClass, "pr-14")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 font-sans text-[11px] font-bold text-[#8b819a] hover:text-[#7c3aed]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <span className="inline-flex items-center gap-1">
                <EyeOff className="h-3.5 w-3.5" /> Hide
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> Show
              </span>
            )}
          </button>
        </Field>

        <Field label="Address" htmlFor="address">
          <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9a8eaa]" />
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            placeholder="Enter your address"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Phone number" htmlFor="phone">
          <Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9a8eaa]" />
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+92 300 1234567"
            required
            className={inputClass}
          />
        </Field>

        <div className="flex items-center justify-between gap-3 pt-0.5 text-[11px]">
          <label className="inline-flex cursor-pointer items-center gap-2 text-[#777184]">
            <input
              type="checkbox"
              name="remember"
              className="h-3.5 w-3.5 accent-[#8b3dff]"
            />
            Remember me
          </label>
          <Link
            href="#forgot-password"
            className="font-bold text-[#6825d9] hover:underline"
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
          className="inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[13px] bg-gradient-to-r from-[#a34dff] via-[#8134ed] to-[#6d29df] font-sans text-[13px] font-extrabold text-white shadow-[0_10px_22px_rgba(131,52,237,0.24)] transition hover:-translate-y-px hover:shadow-[0_13px_25px_rgba(131,52,237,0.3)]"
        >
          Sign in to ClipForge
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden />
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-[10px] text-[#a39aaa]">
        <span className="h-px flex-1 bg-[#eee8f5]" />
        OR
        <span className="h-px flex-1 bg-[#eee8f5]" />
      </div>

      <p className="text-center font-sans text-xs text-[#777184]">
        Don&apos;t have an account?{" "}
        <Link href="#register" className="font-bold text-[#6825d9] hover:underline">
          Create one
        </Link>
      </p>
      <p className="mt-5 text-center font-sans text-[10px] leading-relaxed text-[#a39aaa]">
        By continuing, you agree to our{" "}
        <Link href="#terms" className="font-bold text-[#6825d9] hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#privacy" className="font-bold text-[#6825d9] hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </section>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-[#e8e1f1] bg-white py-0 pr-4 pl-11 font-sans text-[13px] text-[#171126] outline-none transition placeholder:text-[#aaa2b5] focus:border-[#a66aff] focus:shadow-[0_0_0_4px_rgba(139,61,255,0.10)]";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-sans text-xs font-extrabold text-[#30283d]"
      >
        {label}
      </label>
      <div className="relative">{children}</div>
    </div>
  );
}
