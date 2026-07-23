"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SharedStatement = {
  id: number | string;
  bankName: string;
  accountNumber: string;
  startDate: string;
  endDate: string;
  token: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  attemptsRemain: number;
};

function maskAccountNumber(accountNumber?: string) {
  if (!accountNumber) return "Not available";
  if (accountNumber.length <= 4) return accountNumber;
  return `•••• •••• ${accountNumber.slice(-4)}`;
}

function formatDate(date?: string) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return parsed.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ShieldIcon({ className = "h-5 w-5" }: { className?: string }) {
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

function DocumentIcon({ className = "h-5 w-5" }: { className?: string }) {
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
      <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

function LogoutIcon({ className = "h-5 w-5" }: { className?: string }) {
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
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
    </svg>
  );
}

export default function OrganizationDashboardPage() {
  const router = useRouter();

  const [statements, setStatements] = useState<SharedStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [organizationName, setOrganizationName] = useState("Organization");

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountType = localStorage.getItem("accountType");

    if (!token || accountType !== "corporate") {
      router.replace("/corp-login");
      return;
    }

    const storedOrganizationName = localStorage.getItem("organizationName");

    if (storedOrganizationName) {
      setOrganizationName(storedOrganizationName);
    }

    async function loadStatements() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `${serviceUrl}/statement-shares/organization-inbox`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("accountType");
          localStorage.removeItem("organizationId");
          localStorage.removeItem("organizationName");
          router.replace("/corp-login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load shared statements.");
        }

        setStatements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Organization dashboard error:", error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load shared statements.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadStatements();
  }, [router, serviceUrl]);

  const activeCount = useMemo(
    () => statements.filter((item) => item.status === "active").length,
    [statements],
  );

  const expiredCount = useMemo(
    () =>
      statements.filter(
        (item) =>
          item.status !== "active" ||
          new Date(item.expiresAt).getTime() < Date.now(),
      ).length,
    [statements],
  );

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("accountType");
    localStorage.removeItem("organizationId");
    localStorage.removeItem("organizationName");

    router.replace("/corp-login");
  }

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#101828]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/organization/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39aa43] text-white">
              <ShieldIcon className="h-7 w-7" />
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                TrustLedger
              </div>
              <div className="text-xs text-slate-500">Organization Portal</div>
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogoutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#278b36]">
              <BuildingIcon className="h-4 w-4" />
              Corporate Workspace
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome, {organizationName}
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Review statements securely shared with your organization.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Statements
            </p>
            <p className="mt-2 text-3xl font-bold">{statements.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Active Access</p>
            <p className="mt-2 text-3xl font-bold text-[#29953a]">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Expired or Closed
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-700">
              {expiredCount}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold">Shared Statements</h2>
              <p className="mt-1 text-sm text-slate-500">
                Statements customers have shared with your organization.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf8ec] text-[#29953a]">
              <DocumentIcon className="h-6 w-6" />
            </div>
          </div>

          {errorMessage && (
            <div className="m-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-56 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-[#39aa43]" />
                <p className="mt-4 text-sm font-medium text-slate-600">
                  Loading shared statements...
                </p>
              </div>
            </div>
          ) : statements.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf8ec] text-[#29953a]">
                <DocumentIcon className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                No statements shared yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Statements shared with your organization will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px]">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Bank</th>
                    <th className="px-6 py-4">Account</th>
                    <th className="px-6 py-4">Statement Period</th>
                    <th className="px-6 py-4">Shared On</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {statements.map((statement) => {
                    const expired =
                      new Date(statement.expiresAt).getTime() < Date.now();

                    return (
                      <tr key={statement.id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">
                            {statement.bankName}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {maskAccountNumber(statement.accountNumber)}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(statement.startDate)} to{" "}
                          {formatDate(statement.endDate)}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(statement.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              statement.status === "active" && !expired
                                ? "bg-green-50 text-[#29953a]"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {statement.status === "active" && !expired
                              ? "Active"
                              : "Unavailable"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/share/verify/${statement.token}`}
                            className="inline-flex items-center justify-center rounded-lg bg-[#39aa43] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#31993a]"
                          >
                            Open Statement
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
