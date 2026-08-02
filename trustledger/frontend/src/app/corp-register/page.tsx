"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Organization = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

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

function BuildingIcon({ className = "h-5 w-5" }: { className?: string }) {
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
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />
      <path d="M16 9h3a2 2 0 0 1 2 2v10" />
      <path d="M9 7h3" />
      <path d="M9 11h3" />
      <path d="M9 15h3" />
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

export default function CorpRegisterPage() {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  useEffect(() => {
    let cancelled = false;

    async function loadOrganizations() {
      setOrganizationsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `${serviceUrl.replace(/\/$/, "")}/organizations`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          const responseText = await response.text();

          throw new Error(responseText || "Unable to load organizations.");
        }

        const data = (await response.json()) as Organization[];

        if (!cancelled) {
          setOrganizations(
            data
              .filter((organization) => organization.active)
              .sort((a, b) => a.name.localeCompare(b.name)),
          );
        }
      } catch (error) {
        console.error("Organization loading failed:", error);

        if (!cancelled) {
          setOrganizations([]);
          setErrorMessage(
            "Unable to load the organization list. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setOrganizationsLoading(false);
        }
      }
    }

    loadOrganizations();

    return () => {
      cancelled = true;
    };
  }, [serviceUrl]);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!organizationId) {
      setErrorMessage("Please select your organization.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    setRegistering(true);

    try {
      const response = await fetch(
        `${serviceUrl.replace(/\/$/, "")}/auth/corp-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
            organizationId,
          }),
        },
      );

      let data: {
        message?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to register the organization account.",
        );
      }

      setSuccessMessage(
        data.message ||
          "Corporate account created successfully. Redirecting to login...",
      );

      setEmail("");
      setPassword("");
      setOrganizationId("");

      window.setTimeout(() => {
        router.push("/corp-login");
      }, 1200);
    } catch (error) {
      console.error("Corporate registration failed:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to complete registration.",
      );
    } finally {
      setRegistering(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#39aa43] focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50";

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
              <div className="text-xl font-bold tracking-tight">
                TrustLedger
              </div>

              <div className="text-xs text-slate-500">
                Securely Share. Instantly Verify.
              </div>
            </div>
          </Link>

          <Link
            href="/corp-login"
            className="rounded-lg border border-[#39aa43] bg-white px-4 py-2.5 text-sm font-semibold text-[#29953a] transition hover:bg-[#f1fbf3]"
          >
            Bank Login
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-77px)] max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_480px] lg:py-14">
        <div className="hidden max-w-xl lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-[#278b36]">
            <ShieldIcon className="h-4 w-4" />
            Secure Corporate Registration
          </div>

          <h1 className="mt-7 text-5xl font-bold leading-[1.08] tracking-tight">
            Connect your organization to
            <span className="mt-2 block text-[#3caf4b]">TrustLedger</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Create a secure corporate account to receive, verify and download
            statements shared with your organization.
          </p>

          <div className="mt-9 space-y-5">
            {[
              "Organization-specific statement access",
              "Secure QR and share-link verification",
              "Controlled statement downloads",
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9f9eb] text-[#29953a]">
              <BuildingIcon className="h-8 w-8" />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-wide text-[#29953a]">
              Corporate portal
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Bank Registration
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Select your organization and create a secure corporate account.
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

          {successMessage && (
            <div
              role="status"
              className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label
                htmlFor="organizationId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Organization
              </label>

              <div className="relative">
                <BuildingIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <select
                  id="organizationId"
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  disabled={registering}
                  required
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="">
                    {organizationsLoading
                      ? "Loading organizations..."
                      : "Select your organization"}
                  </option>

                  {organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>
                      {organization.name}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ▾
                </span>
              </div>

              {!organizationsLoading && organizations.length === 0 && (
                <p className="mt-2 text-xs text-red-600">
                  No active organization is currently available.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Corporate Email Address
              </label>

              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your corporate email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={registering}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={registering}
                  minLength={6}
                  required
                  className={`${inputClass} pr-16`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#29953a] hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                registering ||
                organizationsLoading ||
                organizations.length === 0
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#39aa43] py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.20)] transition hover:bg-[#31993a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {registering ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating account...
                </>
              ) : (
                <>
                  <ShieldIcon className="h-5 w-5" />
                  Create Organization Account
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Already registered?
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Link
            href="/corp-login"
            className="flex w-full items-center justify-center rounded-xl border border-[#39aa43] bg-white py-3.5 text-sm font-bold text-[#29953a] transition hover:bg-[#f1fbf3]"
          >
            Login to Organization Account
          </Link>

          <p className="mt-5 text-center text-sm text-slate-500">
            Are you a customer?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#29953a] hover:underline"
            >
              Customer Login
            </Link>
          </p>

          <div className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#f1fbf3] px-4 py-3 text-xs text-slate-600">
            <ShieldIcon className="h-4 w-4 text-[#29953a]" />
            Your registration information is securely processed.
          </div>
        </div>
      </section>
    </main>
  );
}
