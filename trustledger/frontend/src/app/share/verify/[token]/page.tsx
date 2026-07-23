"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StatementPdfPreview from "@/components/pdf/StatementPdfPreview";

type ShareData = {
  id: number | string;
  bankName: string;
  accountNumber: string;
  startDate: string;
  endDate: string;
  expiresAt: string;
  attemptsRemain?: number;
  status?: string;
};

type IconName =
  | "shield"
  | "check"
  | "warning"
  | "bank"
  | "calendar"
  | "account"
  | "download"
  | "back"
  | "lock";

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
    case "check":
      return (
        <svg {...props}>
          <path d="m5 12 4 4L19 6" />
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

    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
          <path d="M3 10h18" />
        </svg>
      );

    case "account":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 9h4" />
          <path d="M7 13h7" />
          <path d="M16 9h1" />
        </svg>
      );

    case "download":
      return (
        <svg {...props}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );

    case "back":
      return (
        <svg {...props}>
          <path d="m15 18-6-6 6-6" />
          <path d="M9 12h10" />
        </svg>
      );

    case "lock":
      return (
        <svg {...props}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
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

function formatDateTime(date?: string) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function maskAccountNumber(accountNumber?: string) {
  if (!accountNumber) {
    return "Not available";
  }

  if (accountNumber.length <= 4) {
    return accountNumber;
  }

  return `•••• •••• ${accountNumber.slice(-4)}`;
}

export default function VerifySharePage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();

  const token = params?.token;

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");
  const [share, setShare] = useState<ShareData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  const verifyShareLink = useCallback(async () => {
    if (!token) {
      setValid(false);
      setMessage("The share token is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${serviceUrl}/statement-shares/verify/${token}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setValid(false);
        setMessage(data.message || "This share link could not be verified.");
        setShare(null);
        return;
      }

      setValid(Boolean(data.valid));
      setMessage(
        data.message ||
          (data.valid
            ? "This statement share link is valid."
            : "This statement share link is not valid."),
      );
      setShare(data.data || null);
    } catch (error) {
      console.error("Share verification error:", error);
      setValid(false);
      setMessage("Unable to verify this share link.");
      setShare(null);
    } finally {
      setLoading(false);
    }
  }, [serviceUrl, token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const userToken = localStorage.getItem("token");

    if (!userToken) {
      const redirectPath = `/share/verify/${token}`;

      router.replace(
        `/corp-login?redirect=${encodeURIComponent(redirectPath)}`,
      );
      return;
    }

    verifyShareLink();
  }, [router, token, verifyShareLink]);

 
  function openPdf(title: string, url: string) {
    setPdfTitle(title);
    setPdfUrl(url);
    setShowPdfViewer(true);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf7]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-[#39aa43]" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Verifying secure share link...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#101828]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39aa43] text-white">
              <Icon name="shield" className="h-7 w-7" />
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                TrustLedger
              </div>

              <div className="text-xs text-slate-500">
                Secure Statement Verification
              </div>
            </div>
          </Link>

          <Link
            href="/organization/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-[#29953a]"
          >
            <Icon name="back" className="h-4 w-4" />
            Dashboard
          </Link>

        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="text-center">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
              valid ? "bg-[#e7faea] text-[#29953a]" : "bg-red-50 text-red-600"
            }`}
          >
            <Icon name={valid ? "check" : "warning"} className="h-8 w-8" />
          </div>

          <p
            className={`mt-5 text-sm font-bold uppercase tracking-wide ${
              valid ? "text-[#29953a]" : "text-red-600"
            }`}
          >
            {valid ? "Verified Share Link" : "Access Unavailable"}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Bank Statement Access
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Review the statement-sharing details before downloading the
            authorized financial document.
          </p>
        </div>

        {!valid || !share ? (
          <div className="mt-9 rounded-3xl border border-red-200 bg-white p-7 text-center shadow-sm sm:p-9">
            <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Icon name="warning" className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              This statement cannot be accessed
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
              {message ||
                "The link may be expired, revoked, invalid, or may have reached its download limit."}
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Return to TrustLedger
            </Link>
          </div>
        ) : (
          <div className="mt-9 overflow-hidden rounded-3xl border border-green-200 bg-white shadow-[0_20px_55px_rgba(16,24,40,0.08)]">
            <div className="flex items-start gap-4 border-b border-green-100 bg-[#f1fbf3] px-6 py-5 sm:px-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#29953a]">
                <Icon name="check" className="h-6 w-6" />
              </div>

              <div>
                <h2 className="font-bold text-[#1d7f2c]">
                  Statement access verified
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {message}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-[#fbfdfb] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf8ec] text-[#29953a]">
                      <Icon name="bank" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Financial Institution
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {share.bankName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[#fbfdfb] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf8ec] text-[#29953a]">
                      <Icon name="account" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Account Number
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {maskAccountNumber(share.accountNumber)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf8ec] text-[#29953a]">
                    <Icon name="calendar" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Statement Period
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {formatDate(share.startDate)} to{" "}
                      {formatDate(share.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Link Expiry
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {formatDateTime(share.expiresAt)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Downloads Remaining
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {share.attemptsRemain ?? "Not available"}
                  </p>
                </div>
              </div>

              {message && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-100 bg-[#f1fbf3] px-4 py-3 text-sm text-slate-600">
                  <Icon
                    name="shield"
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#29953a]"
                  />

                  <span>{message}</span>
                </div>
              )}

              <div className="mt-7 space-y-4">
                <button
                  type="button"
                  onClick={() =>
                    openPdf(
                      "Verified Bank Statement",
                      `${appUrl}/sample.pdf`,
                      // Later:
                      // `${serviceUrl}/statement-shares/preview/${token}`
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#39aa43] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#2f9638]"
                >
                  <Icon name="check" className="h-5 w-5" />
                  Preview Statement
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openPdf(
                      "DBR Calculation",
                      `${appUrl}/sample-dbr.pdf`,
                      // Later:
                      // `${serviceUrl}/statement-shares/preview-dbr/${token}`
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#39aa43] bg-white px-6 py-3.5 text-sm font-bold text-[#39aa43] transition hover:bg-green-50"
                >
                  <Icon name="check" className="h-5 w-5" />
                  Preview DBR Calculation
                </button>
              </div>

              {/* <button
                type="button"
                onClick={downloadStatement}
                disabled={downloading}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#39aa43] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.20)] transition hover:bg-[#31993a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Preparing Statement...
                  </>
                ) : (
                  <>
                    <Icon name="download" className="h-5 w-5" />
                    Download Verified Statement
                  </>
                )}
              </button> */}

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <Icon
                  name="lock"
                  className="mt-0.5 h-5 w-5 shrink-0 text-slate-500"
                />

                <p className="text-xs leading-5 text-slate-500">
                  This document is provided through a controlled TrustLedger
                  sharing request. Do not forward the statement or link without
                  authorization.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {showPdfViewer && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6">
          <div className="flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {pdfTitle}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Secure document preview
                </p>
              </div>

              <button
                onClick={() => setShowPdfViewer(false)}
                className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Close
              </button>
            </div>

            <iframe
              src={pdfUrl}
              title={pdfTitle}
              className="flex-1 bg-slate-100"
            />
          </div>
        </div>
      )}
    </main>
  );
}
