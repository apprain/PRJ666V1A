"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import StatementPdfPreview from "@/components/pdf/StatementPdfPreview";

type Organization = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

type IconName =
  | "shield"
  | "back"
  | "bank"
  | "account"
  | "calendar"
  | "download"
  | "link"
  | "copy"
  | "check"
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

    case "bank":
      return (
        <svg {...props}>
          <path d="m3 9 9-6 9 6" />
          <path d="M5 10v8" />
          <path d="M9 10v8" />
          <path d="M15 10v8" />
          <path d="M19 10v8" />
          <path d="M3 21h18" />
          <path d="M4 18h16" />
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

    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
          <path d="M3 10h18" />
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

export default function ShareStatementPage() {
  const router = useRouter();

  const [link, setLink] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [attemptsRemain, setAttemptsRemain] = useState("10");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [organizationsLoading, setOrganizationsLoading] = useState(true);
  const [organizationsError, setOrganizationsError] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const serviceUrl =
    process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  function openPdfPreview(title: string, url: string) {
    setPreviewTitle(title);
    setPreviewPdfUrl(url);
    setPreviewOpen(true);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadOrganizations() {
      setOrganizationsLoading(true);
      setOrganizationsError("");

      try {
        const baseUrl = (
          process.env.NEXT_PUBLIC_SERVICE_URL || "http://localhost:3000"
        ).replace(/\/$/, "");

        const token = localStorage.getItem("token");

        const response = await fetch(`${baseUrl}/organizations`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });

        if (!response.ok) {
          const responseBody = await response.text();

          throw new Error(
            `Unable to load organizations (${response.status})${
              responseBody ? `: ${responseBody}` : ""
            }`,
          );
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "The organization service returned an invalid response.",
          );
        }

        const activeOrganizations = (data as Organization[])
          .filter(
            (organization) =>
              organization &&
              typeof organization.id === "string" &&
              typeof organization.name === "string" &&
              organization.active !== false,
          )
          .sort((a, b) => a.name.localeCompare(b.name));

        if (!cancelled) {
          setOrganizations(activeOrganizations);
        }
      } catch (error) {
        console.error("Organization loading failed:", error);

        if (!cancelled) {
          setOrganizations([]);
          setOrganizationsError(
            error instanceof Error
              ? error.message
              : "Unable to load organizations.",
          );
        }
      } finally {
        if (!cancelled) {
          setOrganizationsLoading(false);
        }
      }
    }

    void loadOrganizations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  async function generateLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setLink("");
    setGeneratedToken("");
    setPreviewOpen(false);
    setCopied(false);

    if (!organizationId) {
      alert("Please select an organization.");
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      setErrorMessage("The end date must be after the start date.");
      return;
    }

    if (expireDate) {
      const selectedExpiry = new Date(`${expireDate}T23:59:59`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedExpiry < today) {
        setErrorMessage("The expiry date cannot be in the past.");
        return;
      }
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${serviceUrl}/statement-shares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bankName,
          accountNumber,
          startDate,
          endDate,
          attemptsRemain: Number(attemptsRemain),
          expireDate,
          organizationId,
        }),
        // body: JSON.stringify({
        //   bankName,
        //   accountNumber: accountNumber.trim(),
        //   startDate,
        //   endDate,
        //   attemptsRemain: Number(attemptsRemain),
        //   expireDate,
        // }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      if (!response.ok || !data.shareLink) {
        setErrorMessage(
          data.message || "Unable to generate the secure share link.",
        );
        return;
      }

      const shareLink = data.shareLink.startsWith("http")
        ? data.shareLink
        : `${appUrl}${data.shareLink.startsWith("/") ? "" : "/"}${data.shareLink}`;

      setLink(shareLink);
      setGeneratedToken(data.token);
    } catch (error) {
      console.error("Error generating link:", error);

      setErrorMessage(
        "Unable to connect to the service. Please try again shortly.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = link;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setErrorMessage("The link could not be copied. Please copy it manually.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#39aa43] focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50";

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#101828]">
      {/* Header */}
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
        {/* Introduction */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#278b36]">
            <Icon name="shield" className="h-4 w-4" />
            Secure statement access
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Share Bank Statement
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Create a controlled and time-limited link that allows an authorized
            recipient to verify and download your bank statement.
          </p>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[1fr_420px]">
          {/* Form */}
          <form
            onSubmit={generateLink}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="border-b border-slate-200 pb-6">
              <p className="text-sm font-bold uppercase tracking-wide text-[#29953a]">
                Statement information
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Configure the sharing request
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select the bank account, statement period, expiry date, and
                maximum number of downloads.
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mt-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <Icon name="warning" className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="mt-7 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="bankName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Bank
                  </label>

                  <div className="relative">
                    <Icon
                      name="bank"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className={`${inputClass} appearance-none pl-12 pr-10`}
                      disabled={loading}
                      required
                    >
                      <option value="">Select a bank</option>
                      <option value="CITYBANK">City Bank</option>
                      <option value="DBBANK">Duck Bangla Bank</option>
                      <option value="UCBANK">United Commercial Bank</option>
                      <option value="BBANK">Brac Bank</option>
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      ▾
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="organizationId"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Share Statement With
                  </label>

                  <div className="relative">
                    <select
                      id="organizationId"
                      value={organizationId}
                      onChange={(event) =>
                        setOrganizationId(event.target.value)
                      }
                      required
                      aria-busy={organizationsLoading}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="">
                        {organizationsLoading
                          ? "Loading organizations..."
                          : "Select an organization"}
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

                  {organizationsError && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                      <Icon
                        name="warning"
                        className="mt-0.5 h-4 w-4 shrink-0"
                      />
                      <span>{organizationsError}</span>
                    </div>
                  )}

                  {!organizationsLoading &&
                    !organizationsError &&
                    organizations.length === 0 && (
                      <p className="mt-2 text-sm text-amber-700">
                        No active organization is currently available.
                      </p>
                    )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="accountNumber"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Account Number
                </label>

                <div className="relative">
                  <Icon
                    name="account"
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="accountNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={13}
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter account number"
                    className={`${inputClass} pl-12`}
                    disabled={loading}
                    required
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Enter numbers only. Your full account number will not be
                  displayed on the public sharing page.
                </p>
              </div>

              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Statement Period
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose the transaction period that the recipient can review.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="mb-2 block text-sm font-medium text-slate-600"
                    >
                      Start Date
                    </label>

                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      max={endDate || undefined}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={inputClass}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="mb-2 block text-sm font-medium text-slate-600"
                    >
                      End Date
                    </label>

                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={inputClass}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="expireDate"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Link Expiry Date
                  </label>

                  <input
                    id="expireDate"
                    type="date"
                    min={today}
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className={inputClass}
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="attemptsRemain"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Maximum Downloads
                  </label>

                  <select
                    id="attemptsRemain"
                    value={attemptsRemain}
                    onChange={(e) => setAttemptsRemain(e.target.value)}
                    className={`${inputClass} appearance-none`}
                    disabled={loading}
                  >
                    <option value="1">1 download</option>
                    <option value="3">3 downloads</option>
                    <option value="5">5 downloads</option>
                    <option value="7">7 downloads</option>
                    <option value="10">10 downloads</option>
                    <option value="20">20 downloads</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#39aa43] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(57,170,67,0.20)] transition hover:bg-[#31993a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating secure link...
                  </>
                ) : (
                  <>
                    <Icon name="link" className="h-5 w-5" />
                    Generate Secure Share Link
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Side information or generated result */}
          <aside className="lg:sticky lg:top-6">
            {!link ? (
              <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#e8f9eb] text-[#29953a]">
                  <Icon name="shield" className="h-7 w-7" />
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  Secure sharing controls
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You remain in control of how long the link works and how many
                  times the statement may be downloaded.
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: "Time-limited access",
                      description:
                        "The link becomes unavailable after the selected expiry date.",
                    },
                    {
                      title: "Download limit",
                      description:
                        "Access stops when the allowed download count is reached.",
                    },
                    {
                      title: "Auditable activity",
                      description:
                        "Statement access and download events can be recorded.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f9eb] text-[#29953a]">
                        <Icon name="check" className="h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-[#f1fbf3] p-4 text-xs leading-5 text-slate-600">
                  Only share the generated link with the intended recipient.
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-[0_20px_50px_rgba(16,24,40,0.08)]">
                <div className="bg-[#39aa43] px-6 py-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                      <Icon name="check" className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="font-bold">Secure link generated</p>
                      <p className="mt-1 text-xs text-green-50">
                        Ready to share with the authorized recipient
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <label
                    htmlFor="generatedLink"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Generated Share Link
                  </label>

                  <textarea
                    id="generatedLink"
                    readOnly
                    rows={3}
                    value={link}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-700 outline-none"
                  />

                  <button
                    type="button"
                    onClick={copyLink}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                      copied
                        ? "border-green-200 bg-green-50 text-[#29953a]"
                        : "border-[#39aa43] bg-white text-[#29953a] hover:bg-[#f1fbf3]"
                    }`}
                  >
                    <Icon
                      name={copied ? "check" : "copy"}
                      className="h-5 w-5"
                    />
                    {copied ? "Link Copied" : "Copy Share Link"}
                  </button>

                  <div className="my-6 h-px bg-slate-200" />

                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800">
                      Scan QR Code
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      The recipient can scan this code to open the secure link.
                    </p>

                    <div className="mx-auto mt-5 w-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <QRCode
                        value={link}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#101828"
                      />
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-green-100 bg-[#f1fbf3] px-4 py-3 text-xs leading-5 text-slate-600">
                    This link expires on{" "}
                    <strong className="text-slate-800">{expireDate}</strong> and
                    allows up to{" "}
                    <strong className="text-slate-800">
                      {attemptsRemain} downloads
                    </strong>
                    .
                  </div>
                  {generatedToken && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#29953a] shadow-sm">
                          <Icon name="download" className="h-6 w-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800">
                            Statement Preview
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Review the generated PDF before sharing the secure
                            link.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openPdfPreview("View Bank Statement", "/sample.pdf")
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#39aa43] bg-white px-4 py-3 text-sm font-bold text-[#29953a] transition hover:bg-[#f1fbf3]"
                      >
                        <Icon name="download" className="h-5 w-5" />
                        Open PDF Preview
                      </button>
                    </div>
                  )}
                  <Link
                    href="/dashboard/shared-links"
                    className="mt-4 flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    View All Shared Links
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {previewOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
          <div className="flex h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-bold">{previewTitle}</h2>

              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg border px-4 py-2"
              >
                Close
              </button>
            </div>

            <iframe
              src={previewPdfUrl}
              className="h-full w-full"
              title={previewTitle}
            />
          </div>
        </div>
      )}

      {/* {previewOpen && generatedToken && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="statement-preview-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewOpen(false);
            }
          }}
        >
          <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="statement-preview-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Statement PDF Preview
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Review the statement before sharing it with the selected
                  organization.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close statement preview"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6">
              <StatementPdfPreview
                token={generatedToken}
                serviceUrl={serviceUrl}
              />
            </div>
          </div>
        </div>
      )} */}
    </main>
  );
}
