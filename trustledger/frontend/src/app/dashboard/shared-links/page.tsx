"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ShareStatus = "active" | "expired" | "revoked";

type StatementShare = {
  id: string;
  bankName: string;
  accountNumber: string;
  startDate: string;
  endDate: string;
  expiresAt: string;
  status: ShareStatus | string;
  shareLink?: string;
  attemptsRemain?: number;
  createdAt?: string;
};

type IconName =
  | "shield"
  | "back"
  | "search"
  | "link"
  | "copy"
  | "check"
  | "calendar"
  | "bank"
  | "empty"
  | "refresh"
  | "plus"
  | "warning";

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const props = {
    className,
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "back":
      return (
        <svg {...props}>
          <path d="m15 18-6-6 6-6" />
          <path d="M9 12h10" />
        </svg>
      );

    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );

    case "link":
      return (
        <svg {...props}>
          <path d="M10 13a5 5 0 0 0 7.1.1l2-2A5 5 0 0 0 12 4l-1.1 1.1" />
          <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
        </svg>
      );

    case "copy":
      return (
        <svg {...props}>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
      );

    case "check":
      return (
        <svg {...props}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
          <path d="M3 10h18" />
        </svg>
      );

    case "bank":
      return (
        <svg {...props}>
          <path d="m3 9 9-6 9 6" />
          <path d="M5 10v8" />
          <path d="M9 10v8" />
          <path d="M15 10v8" />
          <path d="M19 10v8" />
          <path d="M3 21h18" />
        </svg>
      );

    case "empty":
      return (
        <svg {...props}>
          <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
          <path d="M14 2v6h6" />
          <path d="M9 14h6" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...props}>
          <path d="M20 11a8 8 0 1 0 2 5" />
          <path d="M20 4v7h-7" />
        </svg>
      );

    case "plus":
      return (
        <svg {...props}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "warning":
      return (
        <svg {...props}>
          <path d="M10.3 3.6 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );

    default:
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
  }
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "border-green-200 bg-green-50 text-[#278b36]";

    case "expired":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "revoked":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
}

function maskAccountNumber(accountNumber?: string) {
  if (!accountNumber) {
    return "Not available";
  }

  if (accountNumber.length <= 4) {
    return accountNumber;
  }

  return `•••• ${accountNumber.slice(-4)}`;
}

export default function SharedLinksPage() {
  const router = useRouter();

  const [links, setLinks] = useState<StatementShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  const loadLinks = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${serviceUrl}/statement-shares`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Unable to load shared statements.");
        return;
      }

      setLinks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load statement shares:", error);

      setErrorMessage(
        "Unable to connect to the service. Please try again shortly.",
      );
    } finally {
      setLoading(false);
    }
  }, [router, serviceUrl]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const filteredLinks = useMemo(() => {
    const searchValue = searchText.trim().toLowerCase();

    return links.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.status.toLowerCase() === statusFilter;

      const matchesSearch =
        !searchValue ||
        item.bankName?.toLowerCase().includes(searchValue) ||
        item.accountNumber?.toLowerCase().includes(searchValue);

      return matchesStatus && matchesSearch;
    });
  }, [links, searchText, statusFilter]);

  function formatDate(date?: string) {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function createPublicShareLink(item: StatementShare) {
    if (item.shareLink) {
      if (item.shareLink.startsWith("http")) {
        return item.shareLink;
      }

      return `${appUrl}${item.shareLink.startsWith("/") ? "" : "/"}${
        item.shareLink
      }`;
    }

    return `${appUrl}/statement-share/${item.id}`;
  }

  async function copyShareLink(item: StatementShare) {
    const publicLink = createPublicShareLink(item);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(publicLink);
      } else {
        const textArea = document.createElement("textarea");

        textArea.value = publicLink;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedId(item.id);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      setErrorMessage("The share link could not be copied.");
    }
  }

  const activeCount = links.filter(
    (item) => item.status.toLowerCase() === "active",
  ).length;

  const expiredCount = links.filter(
    (item) => item.status.toLowerCase() === "expired",
  ).length;

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#101828]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39aa43] text-white">
              <Icon name="shield" className="h-7 w-7" />
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                TrustLedger
              </div>

              <div className="text-xs text-slate-500">
                Secure Statement Sharing
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-[#29953a]"
          >
            <Icon name="back" className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#278b36]">
              <Icon name="link" className="h-4 w-4" />
              Statement sharing activity
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Shared Statements
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Review generated statement links, expiry information, access
              status, and remaining download limits.
            </p>
          </div>

          <Link
            href="/dashboard/share-statement"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#39aa43] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.20)] transition hover:bg-[#31993a]"
          >
            <Icon name="plus" />
            Share New Statement
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Share Links
            </p>

            <p className="mt-3 text-3xl font-bold">{links.length}</p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50/50 p-5 shadow-sm">
            <p className="text-sm font-medium text-[#278b36]">Active Links</p>

            <p className="mt-3 text-3xl font-bold text-[#278b36]">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
            <p className="text-sm font-medium text-amber-700">Expired Links</p>

            <p className="mt-3 text-3xl font-bold text-amber-700">
              {expiredCount}
            </p>
          </div>
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold">Statement Share Links</h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredLinks.length} record
                  {filteredLinks.length === 1 ? "" : "s"} displayed
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative w-full sm:w-72">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center overflow-hidden text-slate-400">
                    <Icon
                      name="search"
                      className="block h-5 w-5 min-h-5 min-w-5 max-h-5 max-w-5 shrink-0"
                    />
                  </span>

                  <input
                    type="search"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search bank or account"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#39aa43] focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#39aa43] focus:ring-4 focus:ring-green-100"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="revoked">Revoked</option>
                </select>

                <button
                  type="button"
                  onClick={loadLinks}
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <Icon
                    name="refresh"
                    className={loading ? "h-5 w-5 animate-spin" : "h-5 w-5"}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="m-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:m-6">
              <Icon name="warning" className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-green-100 border-t-[#39aa43]" />

              <p className="mt-4 text-sm text-slate-500">
                Loading shared statements...
              </p>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf9ef] text-[#29953a]">
                <Icon name="empty" className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                No shared statements found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create a secure statement link or adjust your search and status
                filters.
              </p>

              <Link
                href="/dashboard/share-statement"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#39aa43] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#31993a]"
              >
                <Icon name="plus" />
                Share a Statement
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-200 md:hidden">
                {filteredLinks.map((item) => (
                  <article key={item.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf9ef] text-[#29953a]">
                          <Icon name="bank" />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            {item.bankName}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {maskAccountNumber(item.accountNumber)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                      <div>
                        <p className="text-xs text-slate-500">
                          Statement Period
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {formatDate(item.startDate)}
                        </p>

                        <p className="text-xs text-slate-500">
                          to {formatDate(item.endDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Expires</p>

                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {formatDate(item.expiresAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Downloads Remaining
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {item.attemptsRemain ?? "Not available"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyShareLink(item)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#39aa43] bg-white px-4 py-3 text-sm font-bold text-[#29953a] transition hover:bg-[#f1fbf3]"
                    >
                      <Icon name={copiedId === item.id ? "check" : "copy"} />

                      {copiedId === item.id ? "Link Copied" : "Copy Share Link"}
                    </button>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                  <thead className="bg-[#f8faf8]">
                    <tr>
                      <th className="border-b border-slate-200 px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Bank and Account
                      </th>

                      <th className="border-b border-slate-200 px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Statement Period
                      </th>

                      <th className="border-b border-slate-200 px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Expiry Date
                      </th>

                      <th className="border-b border-slate-200 px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Downloads Left
                      </th>

                      <th className="border-b border-slate-200 px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      {/* <th className="border-b border-slate-200 px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Action
                      </th> */}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {filteredLinks.map((item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-[#fbfdfb]"
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf9ef] text-[#29953a]">
                              <Icon name="bank" />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {item.bankName}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {maskAccountNumber(item.accountNumber)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-start gap-2">
                            <Icon
                              name="calendar"
                              className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                            />

                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                {formatDate(item.startDate)}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                to {formatDate(item.endDate)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-700">
                          {formatDate(item.expiresAt)}
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex min-w-9 justify-center rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-700">
                            {item.attemptsRemain ?? "—"}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* <td className="px-5 py-5 text-right">
                          <button
                            type="button"
                            onClick={() => copyShareLink(item)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-[#29953a]"
                          >
                            <Icon
                              name={copiedId === item.id ? "check" : "copy"}
                              className="h-4 w-4"
                            />

                            {copiedId === item.id ? "Copied" : "Copy Link"}
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="mt-7 flex items-start gap-4 rounded-2xl border border-green-100 bg-[#f1fbf3] p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#29953a]">
            <Icon name="shield" className="h-6 w-6" />
          </div>

          <div>
            <h2 className="font-bold text-slate-800">
              Secure statement sharing
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Share links should only be provided to the intended recipient.
              Access may be limited by expiry date, status, and remaining
              download count.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
