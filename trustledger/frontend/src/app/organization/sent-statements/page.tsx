"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SentStatement = {
  id: number;
  bankName: string;
  accountNumber: string;
  startDate: string;
  endDate: string;
  token: string;
  status: string;
  expiresAt: string;
  attemptsRemain: number;
  createdAt: string;
  organization?: {
    id: string;
    name: string;
    email?: string;
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function maskAccountNumber(value: string) {
  if (!value) return "-";
  if (value.length <= 4) return value;
  return `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
}

export default function SentStatementsPage() {
  const router = useRouter();

  const [statements, setStatements] = useState<SentStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  async function loadSentStatements() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/corp-login");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${serviceUrl.replace(/\/$/, "")}/statement-shares/sent-by-organization`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load sent statements.",
        );
      }

      setStatements(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load sent statements.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSentStatements();
  }, []);

  const filteredStatements = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return statements;

    return statements.filter((statement) =>
      [
        statement.organization?.name,
        statement.bankName,
        statement.accountNumber,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query),
        ),
    );
  }, [search, statements]);

  return (
    <main className="px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#29953a]">
            Statements
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Sent Statements
          </h1>
          <p className="mt-3 text-slate-600">
            Statements shared by your organization.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadSentStatements()}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="mt-7 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search recipient, bank, or account"
            className="w-full max-w-md rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#39aa43] focus:ring-4 focus:ring-green-100"
          />
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-[#39aa43]" />
              <p className="mt-4 text-sm text-slate-500">
                Loading sent statements...
              </p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="m-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : filteredStatements.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center px-6 text-center">
            <div>
              <h2 className="text-lg font-bold">
                No sent statements found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Statements shared by your organization will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Bank</th>
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Shared On</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4">Attempts</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredStatements.map((statement) => {
                  const expired =
                    new Date(statement.expiresAt).getTime() < Date.now();

                  const available =
                    statement.status === "active" && !expired;

                  return (
                    <tr key={statement.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {statement.organization?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {statement.bankName}
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
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(statement.expiresAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {statement.attemptsRemain}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            available
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {available ? "Active" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/share/verify/${statement.token}`}
                          className="rounded-lg bg-[#39aa43] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#31993a]"
                        >
                          View
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
    </main>
  );
}
