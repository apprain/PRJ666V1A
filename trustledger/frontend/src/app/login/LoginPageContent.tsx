"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ShieldIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function UserIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const isCorporateLogin = Boolean(searchParams.get("redirect"));

  const kycUrl = process.env.NEXT_PUBLIC_KYC_URL || "http://localhost:4000";

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  const loginEndpoint = "login"; //isCorporateLogin ? "corp-login" : "login";

  function gotoRegistration(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    if (isCorporateLogin) {
      router.push("/corp-register");
      return;
    }

    window.location.href = kycUrl;
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${serviceUrl}/auth/${loginEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.access_token) {
        setErrorMessage(data.message || "Unable to log in. Please try again.");
        return;
      }

      localStorage.setItem("token", data.access_token);
      router.push(redirectUrl);
    } catch {
      setErrorMessage(
        "Unable to connect to the service. Please try again shortly.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbfdfb] text-[#101828]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(74,222,128,0.12),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(74,222,128,0.10),transparent_28%)]" />

      <header className="relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39aa43] text-white">
              <ShieldIcon className="h-7 w-7" />
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight text-[#101828]">
                TrustLedger
              </div>

              <div className="text-xs text-slate-500">
                Securely Share. Instantly Verify.
              </div>
            </div>
          </Link>

          <Link
            href="/process-and-guideline"
            className="hidden text-sm font-semibold text-slate-600 transition hover:text-[#29953a] sm:block"
          >
            Help & Guidelines
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-77px)] max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_480px] lg:py-14">
        <div className="hidden max-w-xl lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-[#278b36]">
            <ShieldIcon className="h-4 w-4" />
            Secure Customer Access
          </div>

          <h1 className="mt-7 text-5xl font-bold leading-[1.08] tracking-tight text-[#101828]">
            Welcome back to
            <span className="mt-2 block text-[#3caf4b]">TrustLedger</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Access your secure dashboard to manage statement sharing,
            verification requests, and account activity.
          </p>

          <div className="mt-9 space-y-5">
            {[
              "Secure and protected account access",
              "Manage shared financial statements",
              "Review verification activity",
            ].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7faea] text-[#29953a]">
                  <CheckIcon className="h-5 w-5" />
                </div>

                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_65px_rgba(16,24,40,0.10)] sm:p-9">
          <div className="mb-8">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#e9f9eb] text-[#29953a]">
              <UserIcon className="h-7 w-7" />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-wide text-[#29953a]">
              Secure access
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#101828]">
              {isCorporateLogin ? "Organization Login" : "Customer Login"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {isCorporateLogin
                ? "Access your organization dashboard and manage statement verification requests."
                : "Enter your account details to access your secure TrustLedger dashboard."}
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  name="email"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#39aa43] focus:ring-4 focus:ring-green-100"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#29953a] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  name="password"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#39aa43] focus:ring-4 focus:ring-green-100"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#29953a] hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#39aa43] py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.20)] transition hover:bg-[#31993a] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  <LockIcon className="h-5 w-5" />
                  {isCorporateLogin
                    ? "Login to Organization Account"
                    : "Login to Your Account"}
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              New to TrustLedger?
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Link
            href={isCorporateLogin ? "/corp-register" : "#"}
            onClick={!isCorporateLogin ? gotoRegistration : undefined}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#39aa43] bg-white py-3.5 text-sm font-bold text-[#29953a] transition hover:bg-[#f1fbf3]"
          >
            <UserIcon className="h-5 w-5" />
            {isCorporateLogin
              ? "Register Your Organization"
              : "Create Customer Account"}
          </Link>

          <div className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#f1fbf3] px-4 py-3 text-xs text-slate-600">
            <ShieldIcon className="h-4 w-4 text-[#29953a]" />
            Your account access is protected and securely processed.
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to the TrustLedger terms and privacy
            policy.
          </p>
        </div>
      </section>
    </main>
  );
}
